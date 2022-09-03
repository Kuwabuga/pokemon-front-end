import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { buildS3Backend } from "@/lib/backends";
import { buildAWSProvider } from "@/lib/providers";
import { getHostedZone } from "@/lib/route53";
import { getHostedZoneCertificate } from "@/lib/acm";
import { S3Bucket } from "@cdktf/provider-aws/lib/s3";
import { DEFAULTS, DOMAIN, AWS } from "@/config";

export class WebsiteStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    buildS3Backend(this);

    const defaultRegionProvider = buildAWSProvider(this, AWS.administrativeRegion);
    const regionProvider = buildAWSProvider(this, AWS.region);
    
    const hostedZone = getHostedZone(this, DOMAIN);
    const certificate = getHostedZoneCertificate(this, defaultRegionProvider, DOMAIN);

    const websiteBucket = new S3Bucket(this, "blog_example_com", {
      bucket: "blog.example.com"
    });
  }
}

const app = new App();
new WebsiteStack(app, "website-stack");
app.synth();
