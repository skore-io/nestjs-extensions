import { EventAttributesDto } from '../dto'

export interface EventClientInterface {
  publish(attributes: EventAttributesDto, body: object): Promise<void>
  validate(attributes: EventAttributesDto): Promise<void>
}
