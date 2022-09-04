import { App } from "cdktf";
import { WebsiteStack } from "@/stacks/website";

const app = new App();
new WebsiteStack(app, "website-stack");
app.synth();
