## @skore-io/auth

## Description

This module provides protection to actions/queries through decorators.

## Installation

```bash
$ npm install --save @skore-io/auth
```

## Methods

| Name              | Description                                                                                                                                                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @IsUser()         | Authenticate using a user or session token. Acccepts an array of string roles and validate if token is valid and user has one of the requested roles to proceed. <br> If no role is informed, it only check if token belongs to a valid user. |
| @IsCompany()      | Authenticate using a company token (M2M).                                                                                                                                                                                                     |
| @IsService()      | Authenticate using a service token (Keycloak).                                                                                                                                                                                                |
| @CurrentUser()    | Combine with @IsUser() to get a payload with user data.                                                                                                                                                                                       |
| @CurrentCompany() | Combine with @IsCompany() to get a payload with company data.                                                                                                                                                                                 |

## Usage

Just annotate yout REST actions and Graphql queries/mutations methods with decorator.

The client should send a Bearer authorization header e.g., `'Authorization: Bearer JWT_TOKEN'`.

1. Add `AUTH_BASE_URL` to **.env** in your project.

```env
AUTH_BASE_URL='https://knowledge-staging.skore.io'
```

2. Import the Auth module.

```typescript
// app.module.ts

import { AuthModule } from '@skore-io/auth'

@Module({
  imports: [AuthModule],
})
export class AppModule {}
```

3. Import the decorator and have fun.

```typescript
// your_file.controller.ts

import { CurrentUser, IsUser, User, UserRole } from '@skore-io/auth'
@Controller('contents')
export class ContentController {
  @IsUser([UserRole.admin, UserRole.expert])
  @Get()
  async hello(@CurrentUser() user: User): string {
    return user.companyId
  }
}
```

```typescript
// your_file.controller.ts

import { Company, CurrentCompany, IsCompany } from '@skore-io/auth'
@Controller('contents')
export class ContentController {
  @IsCompany()
  @Get()
  async hello(@CurrentCompany() company: Company): string {
    return company.id
  }
}
```

# Keycloak

- ## env

```env
KEYCLOAK_BASE_URL=https://keycloak.learningrocks.info/auth/realms/learningrocks/protocol/openid-connect
KEYCLOAK_CREDENTIAL=xpto
```

- ## request with token

```ts
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthedRequest } from '@skore-io/auth'

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

- ## validate token

```typescript
// your_file.controller.ts

import { IsService } from '@skore-io/auth'
@Controller('contents')
export class ContentController {
  @IsService()
  @Get()
  async hello(): boolean {
    return true
  }
}
```
