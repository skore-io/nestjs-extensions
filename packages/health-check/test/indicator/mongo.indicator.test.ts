import { Test } from '@nestjs/testing'
import { suite, test } from '@testdeck/jest'
import { Db, MongoClient } from 'mongodb'
import { HealthCheckModule } from 'packages/health-check/src/health-check.module'
import { MongoIndicator } from 'packages/health-check/src/indicator'

@suite('Mongo Indicator')
export class MongoIndicatorTest {
  @test
  async 'Given some'() {
    const indicator = await this.indicator()

    await indicator.pingCheck()

    expect(true).toBeFalsy()
  }

  async indicator(): Promise<MongoIndicator> {
    const mongoClient = await MongoClient.connect(
      'mongodb://paperbottest:paperbottest@localhost?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    )

    console.log(await mongoClient.db('skore_dev').stats())

    const module = await Test.createTestingModule({
      imports: [HealthCheckModule],
      providers: [{ provide: Db, useFactory: () => mongoClient.db('skore_dev') }],
    }).compile()

    const app = await module.createNestApplication().init()

    return app.get(MongoIndicator)
  }
}
