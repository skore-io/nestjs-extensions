<p align="center">
A collection of [NestJS](https://nestjs.com) extensions used by Learning.rocks.
</p>

| Name                                  | Description                                                      |
| ------------------------------------- | ---------------------------------------------------------------- |
| [`Auth`](./packages/auth)             | Authenticate and provide access to users, services and companies |
| [`Bull`](./packages/bull)             | Setup bull queues along with bull-board                          |
| [`Event`](./packages/event)           | Publish events to a topic in Pub/Sub                             |
| [`Pagination`](./packages/pagination) | Paginate graphql queries                                         |

### Local development

This project uses [lerna](https://www.npmjs.com/package/lerna) package to handle sub repo dependencies.

1.  Use correct node version

```bash
$ nvm use
```

2.  Install dependencies

```bash
$ npm i
```

## Test

```bash
$ npm run test
```

### Testing locally

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
npm install path-to-generated-file/skore-io-{package}-{version}.tgz
```
