# `@skore-io/bull`

## Setup bull queues along with bull-board

### Using bull

Setup redis credentials:

```sh
REDIS_URL='redis'
REDIS_PORT='6379'
REDIS_PASSWORD='redispassword'
```

Declaring your queues and enabling `bull-board`

```typescript
@Module({
  imports: [
    // Your ConfigModule should be global to be accessible by QueueModule
    ConfigModule.forRoot({ isGlobal: true }),
    QueueModule.forRoot({
      queues: [{ name: 'content' }, { name: 'video' }],
      // Enable bull-board
      admin: true,
    }),
  ],
})
export class AppModule {}
```

Start your app

```sh
  npm run start:dev
```

Once started you can access bull-board on: `http://localhost:3000/admin/queues`
