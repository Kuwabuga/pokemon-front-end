import { Construct } from "constructs";
import { DataAwsRoute53Zone, DataAwsRoute53ZoneConfig } from "@cdktf/provider-aws/lib/route53";

export const getHostedZone = (scope: Construct, domainName: string): DataAwsRoute53Zone => {
  return new DataAwsRoute53Zone(scope, `${domainName}-hostedZone`, <DataAwsRoute53ZoneConfig>{
    name: domainName
  });
};