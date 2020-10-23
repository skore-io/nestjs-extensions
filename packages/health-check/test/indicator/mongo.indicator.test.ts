import { Test } from '@nestjs/testing'
import { suite, test } from '@testdeck/jest'
import { MongoIndicator } from '../../src/indicator'
import { TestModule } from '../module/test.module'

@suite('Mongo Indicator')
export class MongoIndicatorTest {
  @test
  async 'Given MongoDB OK'() {
    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    }).compile()

    const app = await moduleRef.init()

    const indicator = await app.get(MongoIndicator).pingCheck()

    expect(indicator.mongodb.status).toBe('up')
  }
}
