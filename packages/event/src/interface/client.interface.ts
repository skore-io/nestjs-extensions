import { EventAttributeDto } from '../dto'

export interface EventClientInterface {
  publish(attributes: EventAttributeDto, body: object): Promise<void>
  validate(attributes: EventAttributeDto): Promise<void>
}
