import { EventClient } from '../interface/client'
import { PerformDto } from '../dto/send-event'
import { ClientEventName } from '../enum/client'
import { PubSubClient } from '../client/pub-sub'

export class SendEvent {
  private readonly client: EventClient

  constructor(clientName: ClientEventName) {
    this.client = this.getClient(clientName)
  }

  private getClient(name: string, client: EventClient = null): EventClient {
    const clients = {
      pubsub: client || new PubSubClient(),
    }

    return clients[name]
  }

  async perform(attributes: PerformDto, body: object): Promise<void> {
    await this.client.validate(attributes)

    await this.client.publish(attributes, body)
  }
}
