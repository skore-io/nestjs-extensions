# `@skore-io/bull`

## Setup bull queues along with bull-board

### Using bull

Declaring your queues and enabling `bull-board`

```typescript
@Module({
  imports: [
    BullModule.forRoot(
      {
        useFactory: (configService: ConfigService) => ({
          redis: configService.get('REDIS_CONNECTION'),
          prefix: 'test',
        }),
        inject: [ConfigService],
      },
      { name: 'contents' },
      { name: 'worksheets' },
    ),
  ],
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
