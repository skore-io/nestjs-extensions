import { Test } from '@nestjs/testing'
import { suite, test } from '@testdeck/jest'
import { Db } from 'mongodb'
import { MongoIndicator } from '../../src/indicator'
import { TestModule } from '../module/test.module'

@suite('Mongo Indicator')
export class MongoIndicatorTest {
  @test
  async 'Given MongoDB status up'() {
    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    }).compile()

    const app = await moduleRef.init()

    const indicator = await app.get(MongoIndicator).statusCheck()

    expect(indicator.mongodb.status).toBe('up')

    await app.close()
  }

  @test
  async 'Given MongoDB status down'() {
    const indicator = await new MongoIndicator(({
      stats: () => ({ ok: false }),
    } as unknown) as Db).statusCheck()

    expect(indicator.mongodb.status).toBe('down')
  }

  @test
  async 'Given MongoDB status check throws an exception'() {
    const indicator = new MongoIndicator(({
      stats: () => {
        throw new Error('MongoDB check status failed')
      },
    } as unknown) as Db)

    try {
      await indicator.statusCheck()
    } catch (error) {
      expect(error.message).toBe('MongoDB check status failed')
    }
  }
}
