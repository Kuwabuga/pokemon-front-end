import { Construct } from "constructs";
import { DataAwsRoute53Zone, DataAwsRoute53ZoneConfig, Route53Record, Route53RecordConfig } from "@cdktf/provider-aws/lib/route53";
import { CloudfrontDistribution } from "@cdktf/provider-aws/lib/cloudfront";
import { subdomain, domain } from "@/config";

export const getHostedZone = (
  scope: Construct, 
  id = "default-data-hosted-zone", 
  domainName = domain
): DataAwsRoute53Zone => {
  return new DataAwsRoute53Zone(scope, id, <DataAwsRoute53ZoneConfig>{
    name: domainName
  });
};

export const createHostedZoneRecord = (
  scope: Construct, 
  id = "default-route53-record",
  domainName = `${subdomain}.${domain}`,
  hostedZone: DataAwsRoute53Zone,
  cloudfrontDistribution: CloudfrontDistribution
): Route53Record => {
  return new Route53Record(scope, id, <Route53RecordConfig>{
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