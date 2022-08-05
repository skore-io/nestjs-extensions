import { EventClientInterface } from '../interface'
import { EventAttributesDto } from '../dto'
import { ClientEventNameEnum } from '../enum'
import { PubSubClient } from '../client'

export class SendEventService {
  private readonly client: EventClientInterface

  constructor(clientName: ClientEventNameEnum) {
    this.client = this.getClient(clientName)
  }

  private getClient(name: string, client: EventClientInterface = null): EventClientInterface {
    const clients = {
      pubsub: client || new PubSubClient(),
    }

    return clients[name]
  }

  async perform(attributes: EventAttributesDto, body: object): Promise<void> {
    await this.client.validate(attributes)

    await this.client.publish(attributes, body)
  }
}
