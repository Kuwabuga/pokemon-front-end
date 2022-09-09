# Website

Current default provider AWS region: eu-west-1

## Description
Main website for the Kuwabuga organization!<br>
www.kuwabuga.com

## To do
- Setup lambda@edge (not needed for now)
- Find a way to sync buckets contents with Terraform CDK (not needed at all)
- Properly setup runnig unit and e2e tests on workflows
- Develop frontend

## Unit and End to End Tests Status
[![Run Website's Unit and E2E tests](https://github.com/Kuwabuga/website/actions/workflows/test_application.yml/badge.svg?branch=production)](https://github.com/Kuwabuga/website/actions/workflows/test_application.yml)

## Deployments Status
[![Deploy Infrastructure](https://github.com/Kuwabuga/website/actions/workflows/deploy_infrastructure.yml/badge.svg?branch=production)](https://github.com/Kuwabuga/website/actions/workflows/deploy_infrastructure.yml)<br>
[![Deploy Application](https://github.com/Kuwabuga/website/actions/workflows/deploy_website.yml/badge.svg?branch=production)](https://github.com/Kuwabuga/website/actions/workflows/deploy_website.yml)

## Recommended VS Code extensions
- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [ENV](https://marketplace.visualstudio.com/items?itemName=IronGeek.vscode-env)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (for `application`)

## Notes

### Workflows
#### Run Linting and Infrastructures' Unit Tests
- Self explanatory
- Runs on every commit that contains a change on any file under the folder `infrastructure`
#### Run Website's Unit and E2E tests
- Self explanatory
- Runs on every commit that contains a change on any file under the folder `application`
#### Deploy Infrastructure
- Can only be triggered manually
- Deploys the application to a specific environment depending on the selected branch (if `production` branch deploys to `production` environment, `development` branch to `development` environment, etc..)
- Terraform CDK will check what changes were made and apply them automatically
#### Deploy Application
- Can only be triggered manually
- Deploys the application to a specific environment depending on the selected branch (if `production` branch deploys to `production` environment, `development` branch to `development` environment, etc..)
- It will `sync` with the website S3 bucket the dist folder (outcome of running the `npm run build` command)
- It will invalidate the Cloudfront cache once the S3 bucket is updated

### Infrastructure
- Built using the TypeScript Terraform CDK
- Creates the necessary Route53 records, Cloudfront distributions, S3 buckets and policies
- In case it is the production environment, it also creates a redirect from example.com to www.example.com (supporting both HTTP and HTTPS)
- IT IS NOT RESPONSIBLE FOR SETTING UP THE ROUTE53 DOMAINS AND CERTIFICATES (we do that [here](https://github.com/Kuwabuga/domains-and-certificates))

### Application
- Built using Vite + Vue 3 (TypeScript)
- Under development

# Authors
#### Infrastructure and workflows: [José Cunha](https://github.com/Migas99)
#### Application: [José Cunha](https://github.com/Migas99), [Carina Santos](https://github.com/Cariinacsantos) and [Fábio Mendes](https://github.com/AtumFaboca)

# License
MIT License

Copyright (c) 2022 Kuwabuga

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
