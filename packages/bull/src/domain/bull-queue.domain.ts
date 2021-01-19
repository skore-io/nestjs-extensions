import { BullQueueProcessor } from '@nestjs/bull'

export type BullModuleQueue = {
  name: string
  configKey?: string
  processors?: BullQueueProcessor[]
}
