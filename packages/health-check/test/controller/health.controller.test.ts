import { HttpStatus } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { suite, test } from '@testdeck/jest'
import { Db } from 'mongodb'
import request from 'supertest'
import { TestModule } from '../module/test.module'

@suite('[Health Check] Controller Indicator')
export class HealthControllerTest {
  @test
  async 'Given /health returns 200'() {
    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    }).compile()

    const app = await moduleRef.createNestApplication().init()

    const { body } = await request(app.getHttpServer()).get('/health').expect(HttpStatus.OK)

    expect(body.info.dependencies.status).toBe('up')
    expect(body.info.redis.status).toBe('up')
    expect(body.info.mongodb.status).toBe('up')

    await app.close()
  }

  @test
  async 'Given /health returns error'() {
    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    })
      .overrideProvider(Db)
      .useValue({
        stats: () => {
          throw { message: 'Fake DB error' }
        },
      })
      .compile()

    const app = await moduleRef.createNestApplication().init()

    await request(app.getHttpServer()).get('/health').expect(HttpStatus.SERVICE_UNAVAILABLE)

    await app.close()
  }
}
