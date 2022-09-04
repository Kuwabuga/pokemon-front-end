import { Construct } from "constructs";
import { DataAwsIamPolicyDocument } from "@cdktf/provider-aws/lib/iam";
import { DataAwsS3Bucket, S3Bucket, S3BucketConfig, S3BucketPolicy, S3BucketPolicyConfig, S3BucketPublicAccessBlock, S3BucketPublicAccessBlockConfig, S3BucketWebsiteConfiguration, S3BucketWebsiteConfigurationConfig, S3BucketWebsiteConfigurationRedirectAllRequestsTo } from "@cdktf/provider-aws/lib/s3";
import { DEFAULTS, websiteBucketName, redirectBucketName } from "@/config";
import { Route53Record } from "@cdktf/provider-aws/lib/route53";

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

export const setS3BucketWebsiteConfig = (
  scope: Construct, 
  id = "default-bucket-website-config", 
  bucket: S3Bucket | DataAwsS3Bucket,
  record: Route53Record
): S3BucketWebsiteConfiguration => {
  return new S3BucketWebsiteConfiguration(scope, id, <S3BucketWebsiteConfigurationConfig>{
    bucket: bucket.id,
    redirectAllRequestsTo: <S3BucketWebsiteConfigurationRedirectAllRequestsTo>{
      hostName: record.name,
      protocol: "https"
    }
  });
};