import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
import { AwsProvider } from "@cdktf/provider-aws";
import { buildS3Backend } from "@/lib/backends";
import { buildAWSProvider } from "@/lib/providers";
import { getHostedZone, validateRecord } from "@/lib/route53";
import { createCertificate, validateCertificate } from "@/lib/acm";
import { domains, certificateRegions } from "@/domains";

export class CertificatesStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    buildS3Backend(this, "certificates");

    const defaultProvider = buildAWSProvider(this);

    const providers: AwsProvider[] = [defaultProvider];
    const regions = certificateRegions.filter(region => region != defaultProvider.region);
    regions.forEach(region => {
      providers.push(buildAWSProvider(this, region));
    });

    domains.forEach((domainName, index) => {
      const hostedZone = getHostedZone(this, `data-${index}-hosted-zone`, domainName);
      providers.forEach((provider, index) => {
        const certificate = createCertificate(this, `new-${index}-certificate`, hostedZone, provider);
        const recordValidation = validateRecord(this, `record-${index}-validation`, hostedZone, certificate, provider);
        validateCertificate(this, `certificate-${index}-validation`, certificate, recordValidation, provider);
      });
    });
  }
}