import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { buildS3Backend } from "@/lib/backends";
import { buildAWSProvider } from "@/lib/providers";
import { createHostedZoneRecord, getHostedZone } from "@/lib/route53";
import { getHostedZoneCertificate } from "@/lib/acm";
import { buildWebsiteBucketPolicy, buildRedirectBucketPolicy } from "@/lib/iam";
import { buildWebsiteCloudfrontDistribution, buildCloudfrontOAI, buildRedirectCloudfrontDistribution } from "@/lib/cloudfront";
import { buildWebsiteBucket, buildRedirectBucket, setS3BucketPolicy } from "@/lib/s3";
import { AWS_ADMINISTRATIVE_REGION, IS_PRODUCTION } from "@/config";

export class WebsiteStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    buildS3Backend(this);
    buildAWSProvider(this);
    
    const administrativeRegionProvider = buildAWSProvider(this, AWS_ADMINISTRATIVE_REGION);

    const domainHostedZone = getHostedZone(this);
    const certificate = getHostedZoneCertificate(this, undefined, administrativeRegionProvider);
    const oai = buildCloudfrontOAI(this);

    const websiteBucket = buildWebsiteBucket(this);
    const websitePolicyDocument = buildWebsiteBucketPolicy(this, undefined, websiteBucket, oai);
    setS3BucketPolicy(this, undefined, websiteBucket, websitePolicyDocument);

    const websiteDistribution = buildWebsiteCloudfrontDistribution(this, undefined, undefined, certificate, websiteBucket, oai);
    createHostedZoneRecord(this, undefined, undefined, domainHostedZone, websiteDistribution);

    if (IS_PRODUCTION) {
      // Redirects example.com to www.example.com
      const redirectBucket = buildRedirectBucket(this);
      const redirectBucketPolicyDocument = buildRedirectBucketPolicy(this, undefined, websiteBucket);
      setS3BucketPolicy(this, "redirect-bucket-policy", redirectBucket, redirectBucketPolicyDocument);

      const redirectDistribution = buildRedirectCloudfrontDistribution(this, undefined, undefined, certificate, redirectBucket);
      createHostedZoneRecord(this, "redirect-route53-record", undefined, domainHostedZone, redirectDistribution);
    }
  }
}

const app = new App();
new WebsiteStack(app, "website-stack");
app.synth();
