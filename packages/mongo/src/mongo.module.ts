import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery'
import { DynamicModule } from '@nestjs/common'
import { Db, MongoClient } from 'mongodb'
import { MongoDbClient } from './client'
import {
  DEFAULT_CONNECTION_NAME,
  MongoConnection,
  MongoModuleOptions,
  MONGO_MODULE_OPTS,
} from './domain'
import { EnsureIndexesService } from './service'

/**
 *  Module to init a mongodb connection
 *
 *  This module creates a new mongodb connection for each import
 *  by design, the reason for it is an application that connects
 *  to multiple databases with differents username/password or
 *  even different databases hosts.
 *
 *  This module provide two providers `Db` and `EnsureIndex` decorator
 *
 *  @param options - FactoryProvider which returns `connection: string` in useFactory method
 *
 *  @example <caption>Using Nest's ConfigModule</caption>
 *  ```typescript
 *  MongoModule.register({
 *    useFactory: (configService: ConfigService) => ({
 *      connection: configService.get('MONGO_CONNECTION_URI'),
 *    }),
 *    inject: [ConfigService],
 *  })
 *  ```
 *
 *  Note: You can pass a hard-coded connection string without inject
 *  and params on useFactory function.
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
export class MongoModule {
  static register(options: MongoModuleOptions): DynamicModule {
    return {
      module: MongoModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: MongoDbClient,
          useFactory: async (options: MongoConnection): Promise<MongoDbClient> => {
            const connection = await MongoClient.connect(options.connection, {
              useUnifiedTopology: true,
              useNewUrlParser: true,
            })
            return new MongoDbClient(connection, options.connectionName || DEFAULT_CONNECTION_NAME)
          },
          inject: [MONGO_MODULE_OPTS],
        },
        {
          provide: MONGO_MODULE_OPTS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        {
          provide: Db,
          useFactory: (mongoClient: MongoDbClient) => mongoClient.db(),
          inject: [MongoDbClient],
        },
        {
          provide: EnsureIndexesService,
          useFactory: async (
            db: Db,
            options: MongoConnection,
            discoveryService: DiscoveryService,
          ): Promise<EnsureIndexesService> => {
            return new EnsureIndexesService(
              db,
              options.connectionName || DEFAULT_CONNECTION_NAME,
              discoveryService,
            )
          },
          inject: [Db, MONGO_MODULE_OPTS, DiscoveryService],
        },
      ],

      exports: [Db],
    }
  }
}
