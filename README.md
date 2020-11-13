<p align="center">
A collection of NestJS extensions used by Skore.
</p>

| Name                                     | Description                                                             |
| ---------------------------------------- | ----------------------------------------------------------------------- |
| [`Mongo`](./packages/mongo)              | Ensure mongodb index through decorators and manages mongodb connections |
| [`Pagination`](./packages/pagination)    | Paginate graphql queries                                                |
| [`HealthCheck`](./packages/health-check) | Create health checks with easy setup                                    |
| [`Version`](./packages/version)          | Document versioning based on mongodb triggers                           |
| [`Keycloak`](./packages/keycloak)        | Provides authorization through annotations                              |

**Local Development**

1.  Use correct node version

```bash
  $ nvm use
```

2.  Install dependencies

```bash
  $ npm i -g lerna
  $ lerna bootstrap --hoist
```

3. Run tests

```bash
  $ npm t
```
