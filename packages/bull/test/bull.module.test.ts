import { InjectQueue, Process, Processor } from '@nestjs/bull'
import { HttpStatus, Injectable } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { suite, test } from '@testdeck/jest'
import { Job, Queue } from 'bull'
import request from 'supertest'
import { TestModule } from './module/test.module'

@Processor('test')
class TestProcessor {
  @Process()
  process(job: Job<any>) {
    expect(job.data.test).toBe(true)
  }
}
@Injectable()
class Publisher {
  constructor(@InjectQueue('test') private readonly testQueue: Queue) {}
  publish(data: unknown): Promise<Job<any>> {
    return this.testQueue.add(data)
  }
}

@suite('Bull Module')
export class BullModuleTest {
  after() {
    expect.hasAssertions()
  }

  @test
  async 'Given module with queue declared then should process message'() {
    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
      providers: [TestProcessor, Publisher],
    }).compile()
    const app = await moduleRef.init()

    const publisher = app.get(Publisher)

    await publisher.publish({ test: true })

    await this.waitForProcess()
  }

  @test
  async 'Given module with queue declared then should enable admin'() {
    const moduleRef = await Test.createTestingModule({ imports: [TestModule] }).compile()
    const app = await moduleRef.createNestApplication().init()

    const { status } = await request(app.getHttpServer()).get('/admin/queues').auth('bull', 'board')

    expect(status).toBe(HttpStatus.OK)
  }

  private waitForProcess() {
    return new Promise((resolve) => setTimeout(resolve, 1000))
  }
}
