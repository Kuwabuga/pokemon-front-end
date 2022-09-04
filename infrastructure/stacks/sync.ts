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
}