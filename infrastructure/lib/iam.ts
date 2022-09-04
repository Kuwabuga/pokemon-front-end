import { Construct } from "constructs";
import { DataAwsIamPolicyDocument, DataAwsIamPolicyDocumentConfig, DataAwsIamPolicyDocumentStatementPrincipals } from "@cdktf/provider-aws/lib/iam";
import { DataAwsS3Bucket, S3Bucket } from "@cdktf/provider-aws/lib/s3";

export const buildBucketPolicy = (
  scope: Construct, 
  id = "default-website-bucket-policy-document",
  bucket: S3Bucket | DataAwsS3Bucket,
  actions: string[] = ["s3:GetObject"],
  identifiers: string[]
): DataAwsIamPolicyDocument => {
  return new DataAwsIamPolicyDocument(scope, id, <DataAwsIamPolicyDocumentConfig>{
    statement: [
      {
        actions: actions,
        resources: [bucket.arn,`${bucket.arn}/*`],
        principals: [
          <DataAwsIamPolicyDocumentStatementPrincipals>{
            type: "AWS",
            identifiers: identifiers
          }
        ]
      }
    ]
  });
};