import { Construct } from "constructs";
import { AwsProvider } from "@cdktf/provider-aws";
import { DataAwsAcmCertificate, DataAwsAcmCertificateConfig } from "@cdktf/provider-aws/lib/acm";
import { domain } from "@/config";

export const getHostedZoneCertificate = (
  scope: Construct, 
  domainName = domain, 
  provider: AwsProvider | undefined = undefined
): DataAwsAcmCertificate => {
  return new DataAwsAcmCertificate(scope, `${domainName}-hosted-zone-certificate`, <DataAwsAcmCertificateConfig>{
    domain: domainName,
    types: ["AMAZON_ISSUED"],
    provider: provider
  });
};