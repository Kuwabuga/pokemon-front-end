import { Construct } from "constructs";
import { S3Bucket, S3BucketConfig } from "@cdktf/provider-aws/lib/s3";
import { DEFAULTS } from "@/config";

const buildWebsiteBucket = (scope: Construct, domainName: string): S3Bucket => {
  return new S3Bucket(scope, `${domainName}-bucket`, <S3BucketConfig>{
    bucket: domainName,
    tags: DEFAULTS.tags
  });
};

const buildRedirectBucket = (scope: Construct, domainName: string): S3Bucket => {
  return new S3Bucket(scope, `${domainName}-bucket`, <S3BucketConfig>{
    bucket: domainName,
    tags: DEFAULTS.tags
  });
};
  