# `@skore-io/health-check`

## Description

This module is useful for checking the status of the MongoDB and Redis.

## Installation

```bash
$ npm install --save @skore-io/health-check
```

## Usage

1. Import the Health Check module

```typescript
// app.module.ts

import { HealthCheckModule } from '@skore-io/health-check'

@Module({
  imports: [HealthCheckModule],
})
export class AppModule {}
```

2. Make sure that MongoDB and Redis are up and running.

3. Initialize your application and make a request to **<your_application_url>/health**
