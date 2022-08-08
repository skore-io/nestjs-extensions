import { EventClientInterface } from '../interface'
import { EventAttributeDto } from '../dto'
import { ClientEventNameEnum } from '../enum'
import { PubSubClient } from '../client'
import { ClientNotFoundError } from '../error'

export class SendEventService {
  private readonly client: EventClientInterface

  constructor(clientName: ClientEventNameEnum) {
    this.client = this.getClient(clientName)
  }

  private getClient(name: string, client: EventClientInterface = null): EventClientInterface {
    const clients = {
      pubsub: client || new PubSubClient(),
    }

    if (!clients[name]) {
      throw new ClientNotFoundError()
    }

    return clients[name]
  }

  async perform(attributes: EventAttributeDto, body: object): Promise<void> {
    await this.client.validate(attributes)

    await this.client.publish(attributes, body)
  }
}
