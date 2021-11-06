import basicAuth from 'express-basic-auth'
import {
  BullModule as NestBullModule,
  BullModuleAsyncOptions,
  BullModuleOptions as NestBullOptions,
} from '@nestjs/bull'
import {
  DynamicModule,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common'
import Bull from 'bull'
import { createBullBoard } from 'bull-board'
import { BullAdapter } from 'bull-board/bullAdapter'
import { BullModuleOptions, BullModuleQueue, BULL_MODULE_OPTS } from './domain'

@Module({})
export class BullModule implements NestModule, OnModuleInit {
  private static readonly options: NestBullOptions[] = []
  private static router: any

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

    const { router } = createBullBoard(queues.map(queue => new BullAdapter(queue)))
    BullModule.router = router

    Logger.log(`${queues.length} queues registered`, BullModule.name)
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(basicAuth({ users: { bull: 'board' }, challenge: true, realm: 'bull' }), BullModule.router)
      .forRoutes('/admin/queues')

    Logger.log("Route 'admin/queues' registered", BullModule.name)
  }
}
