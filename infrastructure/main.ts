import { App } from "cdktf";
import { WebsiteStack } from "@/stacks/website";
import { SyncS3BucketStack } from "@/stacks/sync";

const app = new App();
new WebsiteStack(app, "website-stack");
new SyncS3BucketStack(app, "sync-s3-bucket-stack");
app.synth();
