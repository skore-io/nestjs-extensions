import { FactoryProvider } from '@nestjs/common'
import { AdvancedSettings, JobOptions, RateLimiter } from 'bull'

export type BullModuleOptions = Omit<
  FactoryProvider<{
    redis: {
      port: number
      host: string
      password: string
      tls?: boolean
    }
    prefix?: string
    settings?: AdvancedSettings
    limiter?: RateLimiter
    defaultJobOptions?: JobOptions
  }>,
  'provide'
> & { bullBoardBasePath?: string }
