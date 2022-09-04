import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
import { buildS3Backend } from "@/lib/backends";
import { buildAWSProvider } from "@/lib/providers";
import { createHostedZoneRecord, getHostedZone } from "@/lib/route53";
import { getHostedZoneCertificate } from "@/lib/acm";
import { buildWebsiteCloudfrontDistribution, buildCloudfrontOAI, buildRedirectCloudfrontDistribution } from "@/lib/cloudfront";
import { buildS3Bucket, setS3BucketPolicy, setS3BucketBlockPublicAccess, setS3BucketWebsiteConfig } from "@/lib/s3";
import { AWS_ADMINISTRATIVE_REGION, AWS_REGION, IS_PRODUCTION, domain, subdomain } from "@/config";

export class WebsiteStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    buildS3Backend(this);
    buildAWSProvider(this, AWS_REGION);
    
    const administrativeRegionProvider = buildAWSProvider(this, AWS_ADMINISTRATIVE_REGION);
    const domainHostedZone = getHostedZone(this, domain);
    const certificate = getHostedZoneCertificate(this, domain, administrativeRegionProvider);
    
    const websiteBucketName = `${subdomain}.${domain}`;
    const websiteBucket = buildS3Bucket(this, websiteBucketName);
    setS3BucketBlockPublicAccess(this, websiteBucketName, websiteBucket, true);
    const websiteOAI = buildCloudfrontOAI(this, websiteBucketName);
    setS3BucketPolicy(this, websiteBucketName, websiteBucket, undefined, { "AWS": websiteOAI.iamArn }, ["s3:GetObject"]);

    const websiteDistribution = buildWebsiteCloudfrontDistribution(this, websiteBucketName, certificate, websiteBucket, websiteOAI);
    const websiteRecord = createHostedZoneRecord(this, websiteBucketName, domainHostedZone, websiteDistribution);

    if (IS_PRODUCTION) {
      // Redirects example.com to www.example.com
      const redirectBucketName = domain;
      const redirectBucket = buildS3Bucket(this, redirectBucketName);
      setS3BucketBlockPublicAccess(this, redirectBucketName, redirectBucket, false);
      const redirectOAI = buildCloudfrontOAI(this, redirectBucketName);
      setS3BucketPolicy(this, redirectBucketName, redirectBucket, undefined, "*", ["s3:GetObject"]);
      setS3BucketWebsiteConfig(this, redirectBucketName, redirectBucket, websiteRecord);

      const redirectDistribution = buildRedirectCloudfrontDistribution(this, redirectBucketName, certificate, redirectBucket, redirectOAI);
      createHostedZoneRecord(this, redirectBucketName, domainHostedZone, redirectDistribution);
    }
  }
}