import { Module } from '@nestjs/common'
import { Db } from 'mongodb'
import { MongoDbClient } from './client'
import { EnsureIndexesService } from './service'

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
