import { Construct } from "constructs";
import { DataAwsRoute53Zone, DataAwsRoute53ZoneConfig, Route53Record, Route53RecordConfig } from "@cdktf/provider-aws/lib/route53";
import { CloudfrontDistribution } from "@cdktf/provider-aws/lib/cloudfront";

export const getHostedZone = (
  scope: Construct, 
  domainName: string
): DataAwsRoute53Zone => {
  return new DataAwsRoute53Zone(scope, `${domainName}-data-hosted-zone`, <DataAwsRoute53ZoneConfig>{
    name: domainName
  });
};

export const createHostedZoneRecord = (
  scope: Construct, 
  domainName: string,
  hostedZone: DataAwsRoute53Zone,
  cloudfrontDistribution: CloudfrontDistribution
): Route53Record => {
  return new Route53Record(scope, `${domainName}-route53-record`, <Route53RecordConfig>{
    zoneId: hostedZone.id,
    name: domainName,
    type: "A",
    alias: [{
      name: cloudfrontDistribution.domainName,
      zoneId: cloudfrontDistribution.hostedZoneId,
      evaluateTargetHealth: false
    }]
  });
};