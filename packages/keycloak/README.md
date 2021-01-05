# `@skore-io/keycloak`

## Description

This module provides authorization through annotations.

## Installation

```bash
$ npm install --save @skore-io/keycloak
```

## Usage

1. Import the Keycloak module.

```typescript
// app.module.ts

import { KeycloakModule } from '@skore-io/keycloak'

@Module({
  imports: [KeycloakModule],
})
export class AppModule {}
```

2. Make sure that Keycloak is up and running.

## Creating resource

1. Import the CreateResource service.

```typescript
// your_file.service.ts

import { CreateResourceService } from '@skore-io/keycloak'

constructor(
  private readonly createResourceService: CreateResourceService,
) {}
```

2. Call method

```typescript
async someFunction(): Promise<void> {
  const result = await this.createResourceService.perform('realm', { name: 'cool name', displayName: 'cool displayName' })
}
```

## Checking user permissions

1. Import the CheckResourcePermissionService.

```typescript
// your_file.service.ts

import { CheckResourcePermissionService } from '@skore-io/keycloak'

constructor(
  private readonly checkResourcePermissionService: CheckResourcePermissionService,
) {}
```

2. Call method

```typescript
async someFunction(): Promise<void> {
  await this.checkResourcePermissionService.perform(user, ['Movies', 'Downloads'], 'create')
}
```

if the user doesn't have the required permission an error will be thrown

## Protecting actions/queries

Just annotate yout REST actions and Graphql queries/mutations methods with `@Protected()`

The client should send a Bearer authorization header e.g., `'Authorization: Bearer JWT_TOKEN'`

You can also use the `@GetUser` param annotation to get access to the current user
