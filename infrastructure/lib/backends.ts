import { Construct } from "constructs";
import { S3Backend, S3BackendProps } from "cdktf";
import { BACKEND } from "@/config";

export const buildS3Backend = (scope: Construct): S3Backend => {
  return new S3Backend(scope, <S3BackendProps>{
    bucket: BACKEND.bucket,
    key: `${BACKEND.baseKey}/state.tf`,
    region: BACKEND.region,
    acl: BACKEND.acl
  });
};