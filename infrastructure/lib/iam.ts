import { Construct } from "constructs";
import { DataAwsIamPolicyDocument, DataAwsIamPolicyDocumentConfig } from "@cdktf/provider-aws/lib/iam";
import { S3Bucket } from "@cdktf/provider-aws/lib/s3";
import { CloudfrontOriginAccessIdentity } from "@cdktf/provider-aws/lib/cloudfront";

export const buildBucketPolicy = (
  scope: Construct, 
  id = "default-website-bucket-policy-document",
  bucket: S3Bucket,
  oai: CloudfrontOriginAccessIdentity | undefined
): DataAwsIamPolicyDocument => {
  const identifiers: string[] = [];
  if(oai) {
    identifiers.push(`${oai.iamArn}`);
  } else {
    identifiers.push("*");
  }

  return new DataAwsIamPolicyDocument(scope, id, <DataAwsIamPolicyDocumentConfig>{
    statement: [{
      actions: ["s3:GetObject"],
      resources: [`${bucket.arn}/*`],
      principals: [{
        type: "AWS",
        identifiers: identifiers
      }]
    }]
  });
};