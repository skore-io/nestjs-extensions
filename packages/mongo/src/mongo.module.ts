import { Module } from '@nestjs/common'
import { Db } from 'mongodb'
import { MongoDbClient } from './client'
import { EnsureIndexesService } from './service'

/**
 *  Module to init a mongodb connection
 *
 *  This module provide two providers `Db` and `EnsureIndex` decorator
 *
 *  @example <caption>Using Nest's ConfigModule</caption>
 *  ```typescript
 *  @module({
 *    imports: [MongoModule]
 *  })
 *  ```
 *  It expects a `MONGO_CONNECTION_URI` environment variable
 *  and optionally you can overwrite database with `MONGO_DATABASE_NAME` env var
 *
 *  @example <caption>Using Db in a provider</caption>
 *
 *  ```typescript
 *  @Injectable()
 *  export class ContentDocument {
 *    private readonly collection: Collection;
 *    constructor(private readonly db: Db) {
 *      this.collection = db.collection('contents');
 *    }
 *  }
 *  ```
 *
 *  This way you can use `this.collection` to interact with collection
 *
 *  This module register a ShutdownHook for any signal. You **must** enable
 *  shutdownHooks in your main file.
 *
 *  @example <caption>Enabling shutdown hooks</caption>
 *
 *  ```ts
 *  const app = await NestFactory.create(AppModule);
 *  app.enableShutdownHooks();
 *  await app.listen(3000);
 *  ```
 *
 *  If shutdown hooks is disabled connections will remain after app shutdown.
 */
@Module({
  providers: [
    EnsureIndexesService,
    MongoDbClient,
    {
      provide: Db,
      useFactory: async (): Promise<Db> => {
        return new MongoDbClient().init()
      },
    },
  ],
  exports: [Db],
})
export class MongoModule {}
