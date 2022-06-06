<p align="center">
A collection of NestJS extensions used by Skore.
</p>

| Name                                     | Description                                                             |
| ---------------------------------------- | ----------------------------------------------------------------------- |
| [`Auth`](./packages/auth)                | Authenticate and provide access to users and companies                  |
| [`Mongo`](./packages/mongo)              | Ensure mongodb index through decorators and manages mongodb connections |
| [`Pagination`](./packages/pagination)    | Paginate graphql queries                                                |
| [`HealthCheck`](./packages/health-check) | Create health checks with easy setup                                    |
| [`Version`](./packages/version)          | Document versioning based on mongodb triggers                           |
| [`Keycloak`](./packages/keycloak)        | Provides authorization through annotations                              |
| [`Bull`](./packages/bull)                | Setup bull queues along with bull-board                                 |
| [`GoogleAuth`](./packages/google-auth)   | Validate google-auth tokens                                             |

**Local Development**

This project uses [lerna](https://www.npmjs.com/package/lerna) package to handle sub repo dependencies.

1.  Use correct node version

```bash
  $ nvm use
```

2.  Install dependencies

```bash
  $ npm run setup
```

## Test

```bash
$ npm run test
```

### Running locally

You can link projects to test new features before publishing a new release.
Follow these steps:

1. In this project

```bash
npm run build
cd ./packages/{package}
npm pack
```

2. In the other project

```bash
npm install @skore-io-auth-{version}.tgz
```

### Husky Install <sub><sup>(required to commit)</sup></sub> \*

We use [husky](https://www.npmjs.com/package/husky) to handle some hooks like `pre-commit` and `commit-msg`. To install it, you need to run `npm run prepare` or `npx husky install`.

**_If you don't run this command, your code will go up badly indented causing conflicts in the project's code base._**
