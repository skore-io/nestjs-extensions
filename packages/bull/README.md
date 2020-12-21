# `@skore-io/bull`

## Setup bull queues along with bull-board

### Using bull

Setup redis credentials:

```sh
REDIS_CONNECTION='redis://default:redispassword@redis:6379'
```

Declaring your queues and enabling `bull-board`

```typescript
@Module({
  imports: [BullModule.forRoot({ name: 'content' }, { name: 'video' })],
})
export class AppModule {}
```

Start your app

```sh
  npm run start:dev
```

Once started you can access bull-board on: [localhost](http://localhost:3000/admin/queues)

User: bull

Password: board
