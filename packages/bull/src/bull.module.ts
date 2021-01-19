import { BullModule as NestBullModule, BullModuleAsyncOptions } from '@nestjs/bull'
import {
  DynamicModule,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common'
import Bull from 'bull'
import { setQueues, UI as bullBoard } from 'bull-board'
import basicAuth from 'express-basic-auth'
import { BullModuleOptions, BullModuleQueue, BULL_MODULE_OPTS } from './domain'

@Module({})
export class BullModule implements NestModule, OnModuleInit {
  private static readonly options: BullModuleQueue[] = []

  static bullFactory(queue: BullModuleQueue): BullModuleAsyncOptions {
    return {
      useFactory: (options: BullModuleQueue) => {
        const opts = { ...queue, ...options }
        BullModule.options.push(opts)

        return opts
      },
      inject: [BULL_MODULE_OPTS],
    }
  }

  static forRoot(options: BullModuleOptions, ...queues: BullModuleQueue[]): DynamicModule {
    return {
      module: BullModule,
      global: true,
      providers: [
        {
          provide: BULL_MODULE_OPTS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      imports: [
        NestBullModule.registerQueueAsync(
          ...queues.map(queue => {
            return { name: queue.name, ...BullModule.bullFactory(queue) }
          }),
        ),
      ],
      exports: [NestBullModule, BULL_MODULE_OPTS],
    }
  }

  async onModuleInit(): Promise<void> {
    const options = BullModule.options

    const queues = options.map(option => new Bull(option.name, { redis: option.redis }))

    setQueues(queues)
    Logger.log(`${queues.length} queues registered`, BullModule.name)
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(basicAuth({ users: { bull: 'board' }, challenge: true, realm: 'bull' }), bullBoard)
      .forRoutes('/admin/queues')

    Logger.log("Route 'admin/queues' registered", BullModule.name)
  }
}
