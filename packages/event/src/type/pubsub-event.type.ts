import { EventAttributes } from '../type'

export type PubSubEvent = {
  attributes: EventAttributes
  body: { [key: string]: string }
}
