import { Construct } from "constructs";
import { DataAwsIamPolicyDocument } from "@cdktf/provider-aws/lib/iam";
import { DataAwsS3Bucket, DataAwsS3BucketConfig, S3Bucket, S3BucketConfig, S3BucketPolicy, S3BucketPolicyConfig, S3BucketPublicAccessBlock, S3BucketPublicAccessBlockConfig } from "@cdktf/provider-aws/lib/s3";
import { DEFAULTS, subdomain, domain } from "@/config";

export const buildWebsiteBucket = (scope: Construct, subdomainName = subdomain, domainName = domain): S3Bucket => {
  const bucketName = `${subdomainName}.${domainName}`;
  return new S3Bucket(scope, `${bucketName}-bucket`, <S3BucketConfig>{
    bucket: bucketName,
    acl: "private",
    tags: DEFAULTS.tags
  });
};

export const buildRedirectBucket = (scope: Construct, domainName = domain): S3Bucket => {
  return new S3Bucket(scope, `${domainName}-bucket`, <S3BucketConfig>{
    bucket: domainName,
    tags: DEFAULTS.tags
  });
};

export const setS3BucketBlockPublicAccess = (
  scope: Construct,
  id = "default-bucket-public-access",
  bucket: S3Bucket | DataAwsS3Bucket,
  blockPublicAccess = true
) => {
  return new S3BucketPublicAccessBlock(scope, id, <S3BucketPublicAccessBlockConfig>{
    bucket: bucket.id,
    blockPublicAcls: blockPublicAccess,
    blockPublicPolicy: blockPublicAccess,
    ignorePublicAcls: blockPublicAccess,
    restrictPublicBuckets: blockPublicAccess
  });
}

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

export const getS3Bucket = (
  scope: Construct,
  id = "default-data-bucket",
  bucketName = `${subdomain}.${domain}`
): DataAwsS3Bucket => {
  return new DataAwsS3Bucket(scope, id, <DataAwsS3BucketConfig>{
    bucket: bucketName
  });
};