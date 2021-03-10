# `@skore-io/google-auth`

## Validate google-auth tokens

#### Using the GoogleAuthModule

1. Add your expected service accounts from tokens

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

3. Use `@GoogleAuth` decorator in your controllers

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
