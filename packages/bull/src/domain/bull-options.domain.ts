import { FactoryProvider } from '@nestjs/common'
import { AdvancedSettings, RateLimiter } from 'bull'

export type BullModuleOptions = Omit<
  FactoryProvider<{
    redis: {
      port: number
      host: string
      password: string
    }
    prefix?: string
    settings?: AdvancedSettings
    limiter?: RateLimiter
  }>,
  'provide'
> & { bullBoardPath?: string }
