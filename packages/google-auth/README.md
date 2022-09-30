## Description

Lib to validate google-auth tokens.

## Installation

```bash
npm i @skore-io/google-auth
```

## Setup

There are two ways for this to work:

1. Add a google service account file into your project and export in .env
```sh
GOOGLE_APPLICATION_CREDENTIALS='gcloud-service-account.json'
```

**gcloud-service-account.json**: json file must be in root project

2. Add the following two envs <sub><sup>(recommended for serverless)</sup></sub>
```sh
GCP_PROJECT_EMAIL='project-email@appspot.gserviceaccount.com'
GCP_PRIVATE_KEY='----BEGIN PRIVATE
lorem ipsum
n-----END PRIVATE KEY-----\n',
```

### Using the @GoogleAuth() decorator

1. Add your expected service accounts from tokens to **.env**

```sh
GOOGLE_AUTH_AUDIENCE='project1@appspot.gserviceaccount.com,project2@appspot.gserviceaccount.com'
```

2. Import GoogleAuthModule

```typescript
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), GoogleAuthModule],
})
export class AppModule {}
```

3. Use `@GoogleAuth()` decorator in your controllers/resolvers

```typescript
import { GoogleAuth } from '@skore-io/google-auth'

@Controller()
export class AppController {
  @Get()
  @GoogleAuth()
  hello(): string {
    return 'Hello authenticated'
  }
}
```

Now every request will validate token with `verifyIdToken` method from `google-auth-library`
and check if email is either `project1@appspot.gserviceaccount.com` or `project2@appspot.gserviceaccount.com`

### Generating authenticated requests

Use `AuthedRequest` to make requests for endpoints that use `@GoogleAuth()` decorator.

```ts
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthedRequest } from '@skore-io/google-auth'

@Injectable()
export class DummyClient {
  private readonly logger = new Logger(DummyClient.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly authedRequest: AuthedRequest,
  ) {}

  async findDummyById(id: number): Promise<{ id: number; name: string }> {
    try {
      const {
        data: { data, errors },
      } = await this.authedRequest.graphql(
        this.configService.get('PROJECT_BASE_URL'),
        `
          query findDummyById($id: Int!) {
            dummy: findDummyById(id: $id) {
              id
              name
            }
          }
        `,
        { id },
      )

      if (errors?.length) throw Error(errors[0].message)

      return data
    } catch (error) {
      this.logger.error('Error on fetching dummy', error)
      throw new InternalServerErrorException(`Error on fetching dummy: ${error.message}`)
    }
  }
}
```
