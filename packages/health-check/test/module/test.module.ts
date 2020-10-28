import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Db, MongoClient } from 'mongodb'
import { HealthCheckModule } from '../../src'

@Global()
@Module({
  imports: [HealthCheckModule, ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    {
      provide: Db,
      useFactory: async () => {
        const mongoClient = await MongoClient.connect(
          'mongodb://extensions:extensions@localhost?retryWrites=true&w=majority',
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          },
        )

        const db = mongoClient.db('skoredb_dev')
        return db
      },
    },
  ],
  exports: [Db],
})
export class TestModule {}
