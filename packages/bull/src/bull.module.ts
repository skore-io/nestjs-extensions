import basicAuth from 'express-basic-auth'
import {
  BullModule as NestBullModule,
  BullModuleAsyncOptions,
  BullModuleOptions as NestBullOptions,
} from '@nestjs/bull'
import { DynamicModule, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import Bull, { QueueOptions } from 'bull'
import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter'
import { ExpressAdapter } from '@bull-board/express'
import { BullModuleOptions, BullModuleQueue, BULL_MODULE_OPTS } from './domain'

@Module({})
export class BullModule implements NestModule {
  private static readonly options: NestBullOptions[] = []
  private static readonly logger: Logger = new Logger('BullModule')
  private static bullBoardPath = '/admin/queues'

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
    if (options.bullBoardPath) BullModule.bullBoardPath = options.bullBoardPath

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
    const queues = options.map((option) => {
      const bullOptions: QueueOptions = { redis: option.redis }
      if (option.prefix) bullOptions.prefix = option.prefix

      return new Bull(option.name, bullOptions)
    })

    BullModule.logger.log(`${queues.length} queues registered`)

    const serverAdapter = new ExpressAdapter()

    createBullBoard({
      queues: queues.map((q) => new BullAdapter(q)),
      serverAdapter,
    })

    serverAdapter.setBasePath(BullModule.bullBoardPath)

    consumer
      .apply(
        basicAuth({ users: { bull: 'board' }, challenge: true, realm: 'bull' }),
        serverAdapter.getRouter(),
      )
      .forRoutes(BullModule.bullBoardPath)

    BullModule.logger.log(`Route '${BullModule.bullBoardPath}' registered`)
  }
}
