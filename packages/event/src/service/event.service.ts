import { EventClientInterface } from '../interface'
import { EventAttributeDto } from '../dto'
import { ClientEventNameEnum } from '../enum'
import { PubSubClient } from '../client'
import { ClientNotFoundError } from '../error'

export class EventService {
  private readonly client: EventClientInterface

  constructor(clientName: ClientEventNameEnum) {
    this.client = this.getClient(clientName)
  }

  private getClient(name: string, client: EventClientInterface = null): EventClientInterface {
    const clients = {
      pubsub: client || new PubSubClient(),
    }

    if (!clients[name]) throw new ClientNotFoundError()

    return clients[name]
  }

  async send(attributes: EventAttributeDto, body: object, url: string): Promise<void> {
    await this.client.validate(attributes)

    const eventUrl = url || process.env.GCP_EVENTS_PROJECT_URL

    await this.client.publish(attributes, body, eventUrl)
  }

  async sendInBatch(attributes: EventAttributeDto, messages: object[]): Promise<void> {
    await this.client.validate(attributes)

    await this.client.publishInBatch(attributes, messages)
  }
}
