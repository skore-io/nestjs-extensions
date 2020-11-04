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

## Getting access token

1. Import the GetAccessToken service.

```typescript
// your_file.service.ts

import { GetAccessTokenService } from '@skore-io/keycloak'

constructor(
  private readonly getAccessTokenService: GetAccessTokenService,
) {}

async someFunction(): Promise<void> {
  const accessToken = await this.getAccessTokenService.perform('realm', 'username', 'password')
}
```
