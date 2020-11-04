<p align="center">
A collection of NestJS extensions used by Skore.
</p>

| Name                                     | Description                                                             |
| ---------------------------------------- | ----------------------------------------------------------------------- |
| [`Mongo`](./packages/mongo)              | Ensure mongodb index through decorators and manages mongodb connections |
| [`Paginate`](./packages/paginate)        | Paginate graphql queries                                                |
| [`HealthCheck`](./packages/health-check) | Create health checks with easy setup                                    |
| [`Version`](./packages/version)          | Document versioning based on mongodb triggers                           |
| [`Keycloak`](./packages/keycloak)        | Provides authorization through annotations                              |

Local Development

1 - Use project node version
  nvm use

2 - Install dependencies
  npx lerna exec npm install

3 - Run tests
  npm test
