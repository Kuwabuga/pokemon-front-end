
import { Construct } from "constructs";
import { S3Bucket } from "@cdktf/provider-aws/lib/s3";
import { CloudfrontDistribution, CloudfrontDistributionConfig, CloudfrontDistributionOrigin, CloudfrontDistributionOriginS3OriginConfig, CloudfrontOriginAccessIdentity, CloudfrontOriginAccessIdentityConfig } from "@cdktf/provider-aws/lib/cloudfront";
import { DEFAULTS, subdomain, domain } from "@/config";
import { DataAwsAcmCertificate } from "@cdktf/provider-aws/lib/acm";

export const buildCloudfrontOAI = (scope: Construct, id = "default-oai", comment = `${subdomain}.${domain}`) => {
  return new CloudfrontOriginAccessIdentity(scope, id, <CloudfrontOriginAccessIdentityConfig>{
    comment: comment
  });
};

export const buildWebsiteCloudfrontDistribution = (
  scope: Construct,
  id = "default-cloudfront-distribution",
  domainName = `${subdomain}.${domain}`,
  certificate: DataAwsAcmCertificate,
  bucket: S3Bucket,
  oai: CloudfrontOriginAccessIdentity
): CloudfrontDistribution => {
  return new CloudfrontDistribution(scope, id, <CloudfrontDistributionConfig>{
    comment: DEFAULTS.comment,
    enabled: true,
    defaultRootObject: "index.html",
    aliases: [domainName],
    customErrorResponse: [
      {
        errorCode: 403,
        responseCode: 200,
        responsePagePath: "/"
      },
      {
        errorCode: 404,
        responseCode: 200,
        responsePagePath: "/"
      }
    ],
    origin: [
      <CloudfrontDistributionOrigin>{
        originId: bucket.id,
        domainName: bucket.bucketRegionalDomainName,
        s3OriginConfig: <CloudfrontDistributionOriginS3OriginConfig>{
          originAccessIdentity: oai.cloudfrontAccessIdentityPath
        }
      }
    ],
    defaultCacheBehavior: {
      allowedMethods: ["GET", "HEAD"],
      cachedMethods: ["GET", "HEAD"],
      targetOriginId: bucket.id,
      forwardedValues: {
        queryString: false,
        cookies: {
          forward: "none"
        }
      },
      viewerProtocolPolicy: "redirect-to-https",
      minTtl: 0,
      defaultTtl: 0,
      maxTtl: 0
    },
    restrictions: {
      geoRestriction: {
        restrictionType: "none"
      }
    },
    viewerCertificate: {
      acmCertificateArn: certificate.arn,
      sslSupportMethod: "sni-only"
    }
  });
};

export const buildRedirectCloudfrontDistribution = (
  scope: Construct,
  id = "default-redirect-cloudfront-distribution",
  domainName = domain,
  certificate: DataAwsAcmCertificate,
  bucket: S3Bucket,
  oai: CloudfrontOriginAccessIdentity
): CloudfrontDistribution => {
  return new CloudfrontDistribution(scope, id, <CloudfrontDistributionConfig>{
    comment: DEFAULTS.comment,
    enabled: true,
    aliases: [domainName],
    origin: [
      <CloudfrontDistributionOrigin>{
        originId: bucket.id,
        domainName: bucket.bucketRegionalDomainName,
        s3OriginConfig: <CloudfrontDistributionOriginS3OriginConfig>{
          originAccessIdentity: oai.cloudfrontAccessIdentityPath
        }
      }
    ],
    defaultCacheBehavior: {
      allowedMethods: ["GET", "HEAD"],
      cachedMethods: ["GET", "HEAD"],
      targetOriginId: bucket.id,
      forwardedValues: {
        queryString: false,
        cookies: {
          forward: "none"
        }
      },
      viewerProtocolPolicy: "redirect-to-https",
      minTtl: 0,
      defaultTtl: 0,
      maxTtl: 0
    },
    restrictions: {
      geoRestriction: {
        restrictionType: "none"
      }
    },
    viewerCertificate: {
      acmCertificateArn: certificate.arn,
      sslSupportMethod: "sni-only"
    }
  });
};