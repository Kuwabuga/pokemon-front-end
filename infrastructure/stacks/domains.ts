import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
import { buildS3Backend } from "@/lib/backends";
import { buildAWSProvider } from "@/lib/providers";
import { createHostedZone } from "@/lib/route53";
import { domains } from "@/domains";

export class DomainsStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    buildS3Backend(this, "domains");
    buildAWSProvider(this);

    domains.forEach((domainName, index) => {
      createHostedZone(this, `route53-${index}-hosted-zone`, domainName);
    });
  }
}