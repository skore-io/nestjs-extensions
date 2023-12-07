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
  private static bullBoardBasePath = ''

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
    if (options.bullBoardBasePath) BullModule.bullBoardBasePath = options.bullBoardBasePath

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
      const bullOptions: QueueOptions = {}
      if (!option.redis && !option.createClient) {
        throw new Error("You must provide 'redis' or 'createClient' option")
      }

      if (option.redis && option.createClient) {
        throw new Error("You must specify only one option: 'redis' or 'createClient'")
      }

      if (option.createClient) {
        if (!option.prefix.startsWith('{') || !option.prefix.endsWith('}')) {
          throw new Error('createClient must start with "{" and end with "}"')
        }
      }

      if (option.redis) bullOptions.redis = option.redis
      if (option.settings) bullOptions.settings = option.settings
      if (option.createClient) bullOptions.createClient = option.createClient

      bullOptions.prefix = option.prefix || 'bull'

      return new Bull(option.name, bullOptions)
    })

    BullModule.logger.log(`${queues.length} queues registered`)

    const serverAdapter = new ExpressAdapter()
    let bullBoardPath = '/admin/queues'

    if (BullModule.bullBoardBasePath)
      bullBoardPath = `/${BullModule.bullBoardBasePath}`.concat(bullBoardPath)

    serverAdapter.setBasePath(bullBoardPath)

    createBullBoard({
      queues: queues.map((q) => new BullAdapter(q)),
      serverAdapter,
    })

    consumer
      .apply(
        basicAuth({ users: { bull: 'board' }, challenge: true, realm: 'bull' }),
        serverAdapter.getRouter(),
      )
      .forRoutes('/admin/queues')

    BullModule.logger.log(`Route '${bullBoardPath}' registered`)
  }
}
