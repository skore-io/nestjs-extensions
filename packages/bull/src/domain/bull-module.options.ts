import { BullQueueProcessor } from '@nestjs/bull'
import { FactoryProvider } from '@nestjs/common'
import { AdvancedSettings, RateLimiter } from 'bull'

export type BullModuleQueue = {
  name?: string
  configKey?: string
  processors?: BullQueueProcessor[]
  redis?: string
  prefix?: string
  settings?: AdvancedSettings
  limiter?: RateLimiter
}

export type BullModuleOptions = Omit<FactoryProvider<BullModuleQueue>, 'provide'>
