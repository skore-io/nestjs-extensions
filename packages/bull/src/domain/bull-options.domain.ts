import { FactoryProvider } from '@nestjs/common'
import { AdvancedSettings, JobOptions, RateLimiter } from 'bull'
import { RedisOptions, Cluster, Redis } from 'ioredis'

export type BullModuleOptions = Omit<
  FactoryProvider<{
    redis?: {
      port: number
      host: string
      password?: string
      tls?: boolean
    }
    createClient?(
      type: 'client' | 'subscriber' | 'bclient',
      redisOpts?: RedisOptions,
    ): Redis | Cluster
    prefix?: string
    settings?: AdvancedSettings
    limiter?: RateLimiter
    defaultJobOptions?: JobOptions
  }>,
  'provide'
> & { bullBoardBasePath?: string }
