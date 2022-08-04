import { EventClient, EventName, getClient } from './client/client'
import { PerformDto } from './send-event.dto'

export class SendEvent {
  private readonly client: EventClient

  constructor(clientName: EventName) {
    this.client = getClient(clientName)
  }

  async perform(attributes: PerformDto, body: object): Promise<void> {
    this.client.publish(attributes, body)
  }
}
