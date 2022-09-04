import { Construct } from "constructs";
import { Route53Record } from "@cdktf/provider-aws/lib/route53";
import { DataAwsIamPolicyDocument } from "@cdktf/provider-aws/lib/iam";
import { DataAwsS3Bucket, S3Bucket, S3BucketConfig, S3BucketPolicy, S3BucketPolicyConfig, S3BucketPublicAccessBlock, S3BucketPublicAccessBlockConfig, S3BucketWebsiteConfiguration, S3BucketWebsiteConfigurationConfig, S3BucketWebsiteConfigurationRedirectAllRequestsTo } from "@cdktf/provider-aws/lib/s3";
import { DEFAULTS } from "@/config";

export const buildS3Bucket = (scope: Construct, bucketName: string): S3Bucket => {
  return new S3Bucket(scope, `${bucketName}-bucket`, <S3BucketConfig>{
    bucket: bucketName,
    tags: DEFAULTS.tags
  });
};

export const setS3BucketBlockPublicAccess = (
  scope: Construct,
  bucketName: string,
  bucket: S3Bucket | DataAwsS3Bucket,
  blockPublicAccess: boolean
) => {
  return new S3BucketPublicAccessBlock(scope, `${bucketName}-block-public-access`, <S3BucketPublicAccessBlockConfig>{
    bucket: bucket.id,
    blockPublicAcls: blockPublicAccess,
    blockPublicPolicy: blockPublicAccess,
    ignorePublicAcls: blockPublicAccess,
    restrictPublicBuckets: blockPublicAccess
  });
};

export const setS3BucketPolicy = (
  scope: Construct, 
  bucketName: string, 
  bucket: S3Bucket, 
  policy: DataAwsIamPolicyDocument
): S3BucketPolicy => {
  return new S3BucketPolicy(scope, `${bucketName}-set-bucket-policy`, <S3BucketPolicyConfig>{
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