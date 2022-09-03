import { Construct } from "constructs";
import { AwsProvider } from "@cdktf/provider-aws";
import { DataAwsAcmCertificate, DataAwsAcmCertificateConfig } from "@cdktf/provider-aws/lib/acm";

export const getHostedZoneCertificate = (scope: Construct, provider: AwsProvider, domainName: string): DataAwsAcmCertificate => {
  return new DataAwsAcmCertificate(scope, `${domainName}-hostedZoneCertificate`, <DataAwsAcmCertificateConfig>{
    provider: provider,
    domain: domainName,
    types: ["AMAZON_ISSUED"]
  });
};