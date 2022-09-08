
import { Construct } from "constructs";
import { DataAwsAcmCertificate } from "@cdktf/provider-aws/lib/acm";
import { S3Bucket, S3BucketWebsiteConfiguration } from "@cdktf/provider-aws/lib/s3";
import { CloudfrontDistribution, CloudfrontDistributionConfig, CloudfrontDistributionCustomErrorResponse, CloudfrontDistributionDefaultCacheBehavior, CloudfrontDistributionDefaultCacheBehaviorForwardedValues, CloudfrontDistributionDefaultCacheBehaviorForwardedValuesCookies, CloudfrontDistributionOrigin, CloudfrontDistributionOriginCustomOriginConfig, CloudfrontDistributionOriginS3OriginConfig, CloudfrontDistributionRestrictions, CloudfrontDistributionRestrictionsGeoRestriction, CloudfrontDistributionViewerCertificate, CloudfrontOriginAccessIdentity, CloudfrontOriginAccessIdentityConfig } from "@cdktf/provider-aws/lib/cloudfront";
import { DEFAULTS } from "@/config";

export const buildCloudfrontOAI = (scope: Construct, comment: string) => {
  return new CloudfrontOriginAccessIdentity(scope, `${comment}-oai`, <CloudfrontOriginAccessIdentityConfig>{
    comment: comment
  });
};

export const buildWebsiteCloudfrontDistribution = (
  scope: Construct,
  domainName: string,
  certificate: DataAwsAcmCertificate,
  bucket: S3Bucket,
  oai: CloudfrontOriginAccessIdentity,
  defaultTtl = 0,
  maxTtl = 0,
  minTtl = 0
): CloudfrontDistribution => {
  return new CloudfrontDistribution(scope, `website-${domainName}-cloudfront-distribution`,
    <CloudfrontDistributionConfig>{
      comment: DEFAULTS.comment,
      tags: DEFAULTS.tags,
      priceClass: "PriceClass_100",
      enabled: true,
      isIpv6Enabled: true,
      defaultRootObject: "index.html",
      aliases: [domainName],
      customErrorResponse: [
        <CloudfrontDistributionCustomErrorResponse>{
          errorCode: 403,
          responseCode: 200,
          responsePagePath: "/"
        },
        <CloudfrontDistributionCustomErrorResponse>{
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
      defaultCacheBehavior: <CloudfrontDistributionDefaultCacheBehavior>{
        allowedMethods: ["GET", "HEAD"],
        cachedMethods: ["GET", "HEAD"],
        targetOriginId: bucket.id,
        forwardedValues: <CloudfrontDistributionDefaultCacheBehaviorForwardedValues>{
          queryString: true,
          cookies: <CloudfrontDistributionDefaultCacheBehaviorForwardedValuesCookies>{
            forward: "all"
          }
        },
        viewerProtocolPolicy: "redirect-to-https",
        defaultTtl: defaultTtl,
        maxTtl: maxTtl,
        minTtl: minTtl
      },
      restrictions: <CloudfrontDistributionRestrictions>{
        geoRestriction: <CloudfrontDistributionRestrictionsGeoRestriction>{
          restrictionType: "none"
        }
      },
      viewerCertificate: <CloudfrontDistributionViewerCertificate>{
        acmCertificateArn: certificate.arn,
        sslSupportMethod: "sni-only"
      }
    });
};

export const buildRedirectCloudfrontDistribution = (
  scope: Construct,
  domainName: string,
  certificate: DataAwsAcmCertificate,
  bucket: S3Bucket,
  bucketWebsiteConfig: S3BucketWebsiteConfiguration
): CloudfrontDistribution => {
  const maximumTtl = 31536000;
  return new CloudfrontDistribution(scope, `redirect-${domainName}-cloudfront-distribution`,
    <CloudfrontDistributionConfig>{
      comment: DEFAULTS.comment,
      tags: DEFAULTS.tags,
      priceClass: "PriceClass_100",
      enabled: true,
      isIpv6Enabled: true,
      aliases: [domainName],
      origin: [
        <CloudfrontDistributionOrigin>{
          originId: bucket.id,
          domainName: bucketWebsiteConfig.websiteEndpoint,
          customOriginConfig: <CloudfrontDistributionOriginCustomOriginConfig>{
            httpPort: 80,
            httpsPort: 443,
            originProtocolPolicy: "match-viewer",
            originSslProtocols: ["TLSv1", "TLSv1.1", "TLSv1.2"]
          }
        }
      ],
      defaultCacheBehavior: <CloudfrontDistributionDefaultCacheBehavior>{
        allowedMethods: ["GET", "HEAD"],
        cachedMethods: ["GET", "HEAD"],
        targetOriginId: bucket.id,
        forwardedValues: <CloudfrontDistributionDefaultCacheBehaviorForwardedValues>{
          queryString: true,
          cookies: <CloudfrontDistributionDefaultCacheBehaviorForwardedValuesCookies>{
            forward: "all"
          }
        },
        viewerProtocolPolicy: "allow-all",
        defaultTtl: maximumTtl,
        maxTtl: maximumTtl,
        minTtl: maximumTtl,
      },
      restrictions: <CloudfrontDistributionRestrictions>{
        geoRestriction: <CloudfrontDistributionRestrictionsGeoRestriction>{
          restrictionType: "none"
        }
      },
      viewerCertificate: <CloudfrontDistributionViewerCertificate>{
        acmCertificateArn: certificate.arn,
        sslSupportMethod: "sni-only"
      }
    });
};