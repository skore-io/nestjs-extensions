import { PubSubActionEnum, PubSubTypeEventEnum } from '../enum'

export type EventAttributes = {
  type: PubSubTypeEventEnum
  action: PubSubActionEnum
  source: string
  created_at: string
}
