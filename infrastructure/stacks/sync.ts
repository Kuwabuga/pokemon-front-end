import * as path from "path";
import fs from "fs";
import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
import { buildS3Backend } from "@/lib/backends";
import { buildAWSProvider } from "@/lib/providers";
import { getS3Bucket } from "@/lib/s3";
import { S3BucketObject, S3BucketObjectConfig } from "@cdktf/provider-aws/lib/s3";
import { BUILD_PATH } from "@/config";

export class SyncS3BucketStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    buildS3Backend(this, "sync");
    buildAWSProvider(this);

    const websiteBucket = getS3Bucket(this);

    fs.readdirSync(BUILD_PATH).forEach((file, index) => {
      new S3BucketObject(this, `bucket-object-${index}-${path.basename(file)}`, <S3BucketObjectConfig>{
        key: file.replace(BUILD_PATH, ""), 
        bucket: websiteBucket.bucket,
        source: path.resolve(file),
        etag: `${Date.now()}`,
        contentType: path.extname(file)
      });
    });
  }
}