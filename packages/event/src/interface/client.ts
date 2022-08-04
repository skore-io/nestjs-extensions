import { PerformDto } from '../dto/send-event'

export interface EventClient {
  publish(attributes: PerformDto, body: object): Promise<void>
  validate(attributes: PerformDto): Promise<void>
}
