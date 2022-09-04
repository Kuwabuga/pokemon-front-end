import { Construct } from "constructs";
import { AwsProvider } from "@cdktf/provider-aws";

export const buildAWSProvider = (scope: Construct, region: string) => {
  return new AwsProvider(scope, `${region}-provider`, {
    region: region,
    alias: region
  });
};