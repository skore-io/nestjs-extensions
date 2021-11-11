import basicAuth from 'express-basic-auth'
import {
  BullModule as NestBullModule,
  BullModuleAsyncOptions,
  BullModuleOptions as NestBullOptions,
} from '@nestjs/bull'
import { DynamicModule, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import Bull from 'bull'
import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter'
import { ExpressAdapter } from '@bull-board/express'
import { BullModuleOptions, BullModuleQueue, BULL_MODULE_OPTS } from './domain'

@Module({})
export class BullModule implements NestModule {
  private static readonly options: NestBullOptions[] = []
  private static readonly logger: Logger = new Logger(BullModule.name)

  static bullFactory(queue: BullModuleQueue): BullModuleAsyncOptions {
    return {
      useFactory: (options: BullModuleQueue): object => {
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
          ...queues.map((queue) => ({ name: queue.name, ...BullModule.bullFactory(queue) })),
        ),
      ],
      exports: [NestBullModule, BULL_MODULE_OPTS],
    }
  }

  configure(consumer: MiddlewareConsumer): void {
    const options = BullModule.options
    const queues = options.map((option) => new Bull(option.name, { redis: option.redis }))

    BullModule.logger.log(`${queues.length} queues registered`)

    const serverAdapter = new ExpressAdapter()
    createBullBoard({
      queues: queues.map((q) => new BullAdapter(q)),
      serverAdapter,
    })

    serverAdapter.setBasePath('/admin/queues')

    consumer
      .apply(
        basicAuth({ users: { bull: 'board' }, challenge: true, realm: 'bull' }),
        serverAdapter.getRouter(),
      )
      .forRoutes('/admin/queues')

    BullModule.logger.log("Route 'admin/queues' registered")
  }
}
