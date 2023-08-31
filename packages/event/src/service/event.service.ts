import { EventClientInterface } from '../interface'
import { EventAttributeDto } from '../dto'
import { ClientEventNameEnum } from '../enum'
import { PubSubClient } from '../client'
import { ClientNotFoundError } from '../error'
import { PubSubEvent } from '../type'

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

  async send(attributes: EventAttributeDto, body: object, url?: string): Promise<void> {
    await this.client.validate(attributes)

    const eventUrl = url || process.env.GCP_EVENTS_PROJECT_URL

    await this.client.publish(attributes, body, eventUrl)
  }

  async sendToTopic(attributes: EventAttributeDto, body: object, url: string): Promise<void> {
    if (!url) throw new Error('Topic url is required')

    await this.client.publish(attributes, body, url)
  }

  /**
   * @deprecated Use {@link publishInBatch} instead.
   */
  async sendInBatch(attributes: EventAttributeDto, messages: object[]): Promise<void> {
    await this.client.validate(attributes)

    await this.client.publishInBatch(attributes, messages)
  }

  /**
   * The maximum value of items in the batch is 1000
   */
  async publishInBatch(events: PubSubEvent[]): Promise<void> {
    await this.client.publishEventsInBatch(events)
  }
}
