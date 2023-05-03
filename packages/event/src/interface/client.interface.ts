import { EventAttributeDto } from '../dto'

export interface EventClientInterface {
  publish(attributes: EventAttributeDto, body: object, url?: string): Promise<void>
  publishInBatch(attributes: EventAttributeDto, messages: object[]): Promise<void>
  validate(attributes: EventAttributeDto): Promise<void>
}
