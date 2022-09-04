import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
import { buildS3Backend } from "@/lib/backends";
import { buildAWSProvider } from "@/lib/providers";
import { createHostedZoneRecord, getHostedZone } from "@/lib/route53";
import { getHostedZoneCertificate } from "@/lib/acm";
import { buildBucketPolicy } from "@/lib/iam";
import { buildWebsiteCloudfrontDistribution, buildCloudfrontOAI, buildRedirectCloudfrontDistribution } from "@/lib/cloudfront";
import { buildWebsiteBucket, buildRedirectBucket, setS3BucketPolicy, setS3BucketBlockPublicAccess, setS3BucketWebsiteConfig } from "@/lib/s3";
import { AWS_ADMINISTRATIVE_REGION, IS_PRODUCTION, domain, subdomain } from "@/config";

export class WebsiteStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    buildS3Backend(this);
    buildAWSProvider(this);
    
    const administrativeRegionProvider = buildAWSProvider(this, AWS_ADMINISTRATIVE_REGION);

    const domainHostedZone = getHostedZone(this);
    const certificate = getHostedZoneCertificate(this, undefined, administrativeRegionProvider);
    
    const websiteBucketName = `${subdomain}.${domain}`;
    const websiteBucket = buildWebsiteBucket(this);
    setS3BucketBlockPublicAccess(this, undefined, websiteBucket, true);
    const websiteOAI = buildCloudfrontOAI(this, "website-cloudfront-oai", websiteBucketName);
    const websitePolicyDocument = buildBucketPolicy(this, undefined, websiteBucket, undefined, [websiteOAI.iamArn]);
    setS3BucketPolicy(this, undefined, websiteBucket, websitePolicyDocument);

    const websiteDistribution = buildWebsiteCloudfrontDistribution(this, undefined, undefined, certificate, websiteBucket, websiteOAI);
    const websiteRecord = createHostedZoneRecord(this, undefined, `${subdomain}.${domain}`, domainHostedZone, websiteDistribution);

    if (IS_PRODUCTION) {
      // Redirects example.com to www.example.com
      const redirectBucketName = domain;
      const redirectBucket = buildRedirectBucket(this);
      setS3BucketBlockPublicAccess(this, "redirect-bucket-public-access", redirectBucket, true);
      const redirectOAI = buildCloudfrontOAI(this, "redirect-cloudfront-oai", redirectBucketName);
      const redirectBucketPolicyDocument = buildBucketPolicy(
        this, 
        "default-redirect-bucket-policy-document", 
        redirectBucket, 
        undefined, 
        [redirectOAI.iamArn]
      );
      setS3BucketPolicy(this, "redirect-bucket-policy", redirectBucket, redirectBucketPolicyDocument);
      setS3BucketWebsiteConfig(this, undefined, redirectBucket, websiteRecord);

      const redirectDistribution = buildRedirectCloudfrontDistribution(this, undefined, undefined, certificate, redirectBucket, redirectOAI);
      createHostedZoneRecord(this, "redirect-route53-record", domain, domainHostedZone, redirectDistribution);
    }
  }
}