import { FactoryProvider } from '@nestjs/common'
import { AdvancedSettings, JobOptions, RateLimiter } from 'bull'

export type BullModuleOptions = Omit<
  FactoryProvider<{
    redis: {
      port: number
      host: string
      password: string
      tls?: boolean
      role?: string
      sentinels?: Array<{ host: string; port: number }>
      name?: string
    }
    prefix?: string
    settings?: AdvancedSettings
    limiter?: RateLimiter
    defaultJobOptions?: JobOptions
  }>,
  'provide'
> & { bullBoardBasePath?: string }
