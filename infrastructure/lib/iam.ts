import { Construct } from "constructs";
import { DataAwsIamPolicyDocument, DataAwsIamPolicyDocumentConfig } from "@cdktf/provider-aws/lib/iam";
import { S3Bucket } from "@cdktf/provider-aws/lib/s3";
import { CloudfrontOriginAccessIdentity } from "@cdktf/provider-aws/lib/cloudfront";

export const buildWebsiteBucketPolicy = (
  scope: Construct, 
  id = "default-website-bucket-policy-document",
  bucket: S3Bucket,
  oai: CloudfrontOriginAccessIdentity
): DataAwsIamPolicyDocument => {
  return new DataAwsIamPolicyDocument(scope, id, <DataAwsIamPolicyDocumentConfig>{
    statement: [{
      actions: ["s3:GetObject"],
      resources: [`${bucket.arn}/*`],
      principals: [{
        type: "AWS",
        identifiers: [oai.iamArn]
      }]
    }]
  });
};

export const buildRedirectBucketPolicy = (
  scope: Construct, 
  id = "default-redirect-bucket-policy-document",
  bucket: S3Bucket
): DataAwsIamPolicyDocument => {
  return new DataAwsIamPolicyDocument(scope, id, <DataAwsIamPolicyDocumentConfig>{
    statement: [{
      actions: ["s3:GetObject"],
      resources: [`${bucket.arn}/*`],
      principals: [{
        type: "AWS",
        identifiers: ["*"]
      }]
    }]
  });
};