import { Test } from '@nestjs/testing'
import { suite, test } from '@testdeck/jest'
import { RedisService } from 'nestjs-redis'
import { RedisIndicator } from '../../src/indicator'
import { TestModule } from '../module/test.module'

@suite('Redis Indicator')
export class RedisIndicatorTest {
  @test
  async 'Given Redis status up'() {
    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    }).compile()

    const app = await moduleRef.init()

    const indicator = await app.get(RedisIndicator).statusCheck()

    expect(indicator.redis.status).toBe('up')
  }

  @test
  async 'Given Redis status down'() {
    const indicator = await new RedisIndicator(({
      getClient: () => ({ info: () => '' }),
    } as unknown) as RedisService).statusCheck()

    expect(indicator.redis.status).toBe('down')
  }

  @test
  async 'Given Redis status check throws an exception'() {
    const indicator = new RedisIndicator(({
      getClient: () => {
        throw new Error()
      },
    } as unknown) as RedisService)

    try {
      await indicator.statusCheck()
    } catch (error) {
      expect(error.message).toBe('Check redis failed')
    }
  }
}
