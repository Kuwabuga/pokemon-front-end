import { exec } from "child_process";
import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
import { buildS3Backend } from "@/lib/backends";
import { BUILD_PATH, subdomain, domain } from "@/config";

/*
  TODO find viable way to sync an S3 bucket content through CDKTF
*/
export class SyncS3BucketStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    buildS3Backend(this, "sync");
    this.sync(`../../${BUILD_PATH}`, `${subdomain}.${domain}`);
  }

  async sync(path: string, bucket: string): Promise<void> {
    const { stdout, stderr } = exec(`aws s3 sync ${path} s3://${bucket}`);
    console.log(stdout);
    console.log(stderr);
  }

  // Get all the files from build folder, skip directories
  // const files = glob.sync('../web/build/**/*', { absolute: false, nodir: true });

  // // Create bucket object for each file
  // for (const file of files) {
  //   new S3BucketObject(this, `aws_s3_bucket_object_${path.basename(file)}`, {
  //     dependsOn: [bucket],
  //     key: file.replace(`../web/build/`, ''),       // Using relative path for folder structure on S3
  //     bucket: BUCKET_NAME,
  //     source: path.resolve(file),          // Using absolute path to upload
  //     etag: `${Date.now()}`,
  //     contentType: mime.contentType(path.extname(file)) || undefined       // Set the content-type for each object
  //   });
  // }
}