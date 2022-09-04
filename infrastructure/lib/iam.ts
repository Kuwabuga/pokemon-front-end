import { Construct } from "constructs";
import { DataAwsIamPolicyDocument, DataAwsIamPolicyDocumentConfig, DataAwsIamPolicyDocumentStatement, DataAwsIamPolicyDocumentStatementPrincipals } from "@cdktf/provider-aws/lib/iam";
import { DataAwsS3Bucket, S3Bucket } from "@cdktf/provider-aws/lib/s3";

export const buildBucketPolicy = (
  scope: Construct, 
  bucketName: string,
  bucket: S3Bucket | DataAwsS3Bucket,
  sid: string | undefined,
  actions: string[],
  identifiers: string[]
): DataAwsIamPolicyDocument => {
  return new DataAwsIamPolicyDocument(scope, `${bucketName}-policy-document`, <DataAwsIamPolicyDocumentConfig>{
    statement: [
      <DataAwsIamPolicyDocumentStatement>{
        sid: sid,
        actions: actions,
        resources: [`${bucket.arn}/*`],
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