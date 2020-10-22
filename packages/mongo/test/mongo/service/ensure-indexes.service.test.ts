import { Test, TestingModule } from '@nestjs/testing'
import { suite, test } from '@testdeck/jest'
import { Collection, Db } from 'mongodb'
import { MongoModule } from 'packages/mongo/src'
import { TestDocument } from 'packages/mongo/test/mongo/document'

@suite('MongoModule EnsureIndexesService')
export class EnsureIndexesServiceTest {
  private app: TestingModule
  private collection: Collection

  async before() {
    const module = await Test.createTestingModule({
      imports: [MongoModule],
      providers: [TestDocument],
    }).compile()

    this.app = await module.init()
    this.collection = this.app.get<Db>(Db).collection('test')
  }

  @test()
  async 'Creates indexes for anotated class'() {
    expect(this.collection.indexExists('my_cool_index'))
    expect(await this.collection.indexInformation()).toEqual({
      _id_: [['_id', 1]],
      my_cool_index: [['public', 1]],
      my_other_cool_index: [['other_field', 1]],
    })
  }
}
