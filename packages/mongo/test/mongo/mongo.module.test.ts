import { Test, TestingModule } from '@nestjs/testing'
import { suite, test } from '@testdeck/jest'
import { Db } from 'mongodb'
import { TestModule } from './module/test.module'

const TOPOLOGY_CLOSED = 'Topology is closed, please connect'

@suite('Mongo Module')
export class MongoModuleTest {
  private db: Db
  private app: TestingModule

  async before() {
    const testingModule = await Test.createTestingModule({ imports: [TestModule] }).compile()

    this.app = await testingModule.init()
    this.db = this.app.get<Db>(Db)
  }

  @test
  async 'Provides a db'() {
    expect(this.db).toBeInstanceOf(Db)

    await this.app.close()
  }

  @test
  async 'Closes the db after app close'() {
    expect.assertions(1)
    await this.app.close()

    try {
      await this.db.collection('some_collection').findOne({})
    } catch (error) {
      expect(error.message).toEqual(TOPOLOGY_CLOSED)
    }
  }
}
