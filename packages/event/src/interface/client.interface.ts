import { EventAttributeDto } from '../dto'
import { PubSubEvent } from '../type'

export interface EventClientInterface {
  publish(attributes: EventAttributeDto, body: object, url?: string): Promise<void>
  publishInBatch(attributes: EventAttributeDto, messages: object[]): Promise<void>
  publishEventsInBatch(events: PubSubEvent[]): Promise<void>
  validate(attributes: EventAttributeDto): Promise<void>
}
