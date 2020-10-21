import { Global, Module } from '@nestjs/common'
import { Db, MongoClient } from 'mongodb'
import { VersionModule } from '../../src'

@Global()
@Module({
  imports: [VersionModule],
  providers: [
    {
      provide: Db,
      useFactory: async () => {
        const mongoClient = await MongoClient.connect(
          'mongodb://extensions:extensions@mongodb?retryWrites=true&w=majority',
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          },
        )
        const db = mongoClient.db('skoredb_dev')
        db.createIndex('versions', { document_collection: 1, document_id: 1 })
        return db
      },
    },
  ],
  exports: [Db],
})
export class TestModule {}
