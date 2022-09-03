import { Construct } from "constructs";
import { DataAwsAcmCertificate, DataAwsAcmCertificateConfig } from "@cdktf/provider-aws/lib/acm";
import { domain } from "@/config";

export const getHostedZoneCertificate = (scope: Construct, domainName = domain): DataAwsAcmCertificate => {
  return new DataAwsAcmCertificate(scope, `${domainName}-hosted-zone-certificate`, <DataAwsAcmCertificateConfig>{
    domain: domainName,
    types: ["AMAZON_ISSUED"]
  });
};