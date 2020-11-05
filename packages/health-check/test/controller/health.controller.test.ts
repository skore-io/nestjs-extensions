import { HttpStatus } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { suite, test } from '@testdeck/jest'
import { MongoIndicator } from '../../src/indicator'
import request from 'supertest'
import { TestModule } from '../module/test.module'

@suite('Mongo Indicator')
export class HealthControllerTest {
  @test
  async 'Given /health returns 200'() {
    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    }).compile()

    const app = await moduleRef.createNestApplication().init()

    const { body } = await request(app.getHttpServer())
      .get('/health')
      .expect(HttpStatus.OK)

    expect(body.info.redis.status).toBe('up')
    expect(body.info.mongodb.status).toBe('up')

    await app.close()
  }

  @test
  async 'Given /health returns error'() {
    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    })
      .overrideProvider(MongoIndicator)
      .useValue({
        statusCheck: () => {
          throw Error
        },
      })
      .compile()

    const app = await moduleRef.createNestApplication().init()

    await request(app.getHttpServer())
      .get('/health')
      .expect(HttpStatus.SERVICE_UNAVAILABLE)

    await app.close()
  }
}
