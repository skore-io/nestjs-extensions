## @skore-io/auth

## Description

This module provides protection to actions/queries through decorators.

## Installation

```bash
$ npm install --save @skore-io/auth
```

## Methods

| Name              | Description                                                                                                                                                                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @IsUser()         | Authenticate using an user or session token. Acccepts an array of string roles and validate if token is valid and user has one of the requested roles to proceed. <br> If no role is informed, it only check if token belongs to a valid user. |
| @IsCompany()      | Authenticate using a company token (M2M).                                                                                                                                                                                                      |
| @CurrentUser()    | Combine with @IsUser() to get a payload with user data.                                                                                                                                                                                        |
| @CurrentCompany() | Combine with @IsCompany() to get a payload with company data.                                                                                                                                                                                  |

## Usage

Just annotate yout REST actions and Graphql queries/mutations methods with decorator.

The client should send a Bearer authorization header e.g., `'Authorization: Bearer JWT_TOKEN'`.

1. Add `AUTH_BASE_URL` to **.env** in your project.

```env
AUTH_BASE_URL='https://knowledge-staging.skore.io'
```

2. Import the decorator and have fun

```typescript
import { IsUser, CurrentUser } from '@skore-io/auth'
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
import { IsCompany, CurrentCompany } from '@skore-io/auth'
@Controller('contents')
export class ContentController {
  @IsCompany()
  @Get()
  async hello(@CurrentCompany() company: Company): string {
    return company.id
  }
}
```
