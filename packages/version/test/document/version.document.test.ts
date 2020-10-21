import { Global, Module } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { suite, test } from '@testdeck/jest'
import { Db, MongoClient, ObjectID } from 'mongodb'
import { VersionModule } from '../../src'
import { VersionDocument } from '../../src/document'

@suite('Version document test')
export class VersionDocumentTest {
  @test
  async 'Given document without versions then return empty list'() {
    const module = await this.getModule()
    const doc = module.get(VersionDocument)

    const versions = await doc.findVersionsFor(
      'contents',
      ObjectID.createFromTime(Date.now()).toHexString(),
    )

    expect(versions).toHaveLength(0)
  }

  @test
  async 'Given document with 1 version return it'() {
    const module = await this.getModule()
    const db = module.get(Db)
    const document = module.get(VersionDocument)
    const docId = ObjectID.createFromTime(Date.now()).toHexString()
    await db.collection('versions').insertOne({
      created_at: Date.now(),
      document_id: docId,
      document_type: 'contents',
      document_data: {
        title: 'Sample',
      },
    })

    const versions = await document.findVersionsFor<Content>('contents', docId)

    expect(versions).toHaveLength(1)
    expect(versions[0].documentId).toBe(docId)
    expect(versions[0].documentData.title).toBe('Sample')
  }

  @test
  async 'Given document with many versions return sorted'() {
    const firstDate = Date.now()
    const module = await this.getModule()

    const document = module.get(VersionDocument)
    const docId = ObjectID.createFromTime(Date.now()).toHexString()
    await module
      .get(Db)
      .collection('versions')
      .insertMany([
        {
          created_at: firstDate,
          document_id: docId,
          document_type: 'contents',
          document_data: {
            title: 'Sample 1',
          },
        },
        {
          created_at: Date.now(),
          document_id: docId,
          document_type: 'contents',
          document_data: {
            title: 'Sample 2',
          },
        },
      ])

    const versions = await document.findVersionsFor<Content>('contents', docId)

    expect(versions).toHaveLength(2)
    expect(versions[0].documentData.title).toBe('Sample 2')
    expect(versions[1].documentData.title).toBe('Sample 1')
  }

  private async getModule(): Promise<TestingModule> {
    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    }).compile()
    return moduleRef.init()
  }
}

class Content {
  title: string
}

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
        db.createIndex('versions', { document_type: 1, document_id: 1 })
        return db
      },
    },
  ],
  exports: [Db],
})
class TestModule {}
