# `@skore-io/bull`

## Description

This module setup bull queues along with bull-board

### Usage

Add `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASSWORD` to **.env** in your project.

```typescript
@Module({
  imports: [
    BullModule.forRoot(
      {
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            password: configService.get('REDIS_PASSWORD'),
          },
          prefix: 'my_application',
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

Once started you can access bull-board on: [localhost](http://localhost:3000/admin/queues) or if you need to change this route pass a value for `bullBoardPath`.

User: bull
Password: board
