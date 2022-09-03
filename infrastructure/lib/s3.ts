import { Construct } from "constructs";
import { DataAwsIamPolicyDocument } from "@cdktf/provider-aws/lib/iam";
import { S3Bucket, S3BucketConfig, S3BucketPolicy, S3BucketPolicyConfig } from "@cdktf/provider-aws/lib/s3";
import { DEFAULTS, subdomain, domain } from "@/config";

export const buildWebsiteBucket = (scope: Construct, subdomainName = subdomain, domainName = domain): S3Bucket => {
  const bucketName = `${subdomainName}.${domainName}`;
  return new S3Bucket(scope, `${bucketName}-bucket`, <S3BucketConfig>{
    bucket: bucketName,
    tags: DEFAULTS.tags
  });
};

export const buildRedirectBucket = (scope: Construct, domainName = domain): S3Bucket => {
  return new S3Bucket(scope, `${domainName}-bucket`, <S3BucketConfig>{
    bucket: domainName,
    tags: DEFAULTS.tags
  });
};

export const setS3BucketPolicy = (
  scope: Construct, 
  id = "default-bucket-policy", 
  bucket: S3Bucket, 
  policy: DataAwsIamPolicyDocument
): S3BucketPolicy => {
  return new S3BucketPolicy(scope, id, <S3BucketPolicyConfig>{
    bucket: bucket.id,
    policy: policy.json
  });
};