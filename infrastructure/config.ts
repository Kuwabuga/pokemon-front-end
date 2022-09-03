export const AWS_ADMINISTRATIVE_REGION = "us-east-1";
export const AWS_REGION = process.env.AWS_REGION || "eu-west-1";
export const AWS_TERRAFORM_BUCKET = process.env.AWS_TERRAFORM_BUCKET;
export const ENVIRONMENT = process.env.ENVIRONMENT || "development";
export const SERVICE_NAME = process.env.SERVICE_NAME || "website";
export const IS_PRODUCTION = ENVIRONMENT == "production" || ENVIRONMENT == "prod";
export const BUILD_PATH = process.env.BUILD_PATH || "application/dist";

export const DEFAULTS = {
  comment: "Managed by Terraform CDK",
  tags: undefined
};

export const BACKEND = {
  bucket: AWS_TERRAFORM_BUCKET,
  baseKey: `${ENVIRONMENT}/${SERVICE_NAME}`,
  region: AWS_REGION,
  acl: "bucket-owner-full-control"
};

const config: { [index: string]: { subdomain: string, domain: string }; } = {
  "development": {
    subdomain: "development",
    domain: "kuwabuga.com"
  },
  "production": {
    subdomain: "www",
    domain: "kuwabuga.com"
  }
};

export const subdomain = config[ENVIRONMENT].subdomain;
export const domain = config[ENVIRONMENT].domain;