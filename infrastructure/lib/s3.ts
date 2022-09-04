import { Construct } from "constructs";
import { DataAwsIamPolicyDocument } from "@cdktf/provider-aws/lib/iam";
import { DataAwsS3Bucket, S3Bucket, S3BucketConfig, S3BucketPolicy, S3BucketPolicyConfig, S3BucketPublicAccessBlock, S3BucketPublicAccessBlockConfig } from "@cdktf/provider-aws/lib/s3";
import { DEFAULTS, websiteBucketName, redirectBucketName } from "@/config";

export const buildWebsiteBucket = (scope: Construct, bucketName = websiteBucketName): S3Bucket => {
  return new S3Bucket(scope, `${bucketName}-bucket`, <S3BucketConfig>{
    bucket: bucketName,
    tags: DEFAULTS.tags
  });
};

export const buildRedirectBucket = (scope: Construct, bucketName = redirectBucketName): S3Bucket => {
  return new S3Bucket(scope, `${bucketName}-bucket`, <S3BucketConfig>{
    bucket: bucketName,
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