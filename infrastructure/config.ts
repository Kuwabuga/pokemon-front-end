export const ENVIRONMENT = process.env.ENVIRONMENT || "development";

export const DEFAULTS = {
  comment: "Managed by Terraform CDK",
  tags: undefined
};

export const AWS = {
  administrativeRegion: "us-east-1",
  region: process.env.AWS_REGION || "us-east-1"
};

export const BACKEND = {
  bucket: process.env.AWS_TERRAFORM_BUCKET,
  baseKey: `${process.env.SERVICE_NAME}`,
  region: AWS.region,
  acl: "bucket-owner-full-control"
};

export const DOMAIN = "kuwabuga.com";