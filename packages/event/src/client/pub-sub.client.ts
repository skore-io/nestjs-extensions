import { GoogleAuth } from 'google-auth-library'
import { PubSub } from '@google-cloud/pubsub'
import { validateOrReject, ValidationError } from 'class-validator'
import { EventClientInterface } from '../interface'
import { PubSubAttributeDto } from '../dto'
import { PublishPubSubError, ValidationAttributeError } from '../error'
import { PubSubEvent } from '../type'

export class PubSubClient implements EventClientInterface {
  private readonly googleAuth: GoogleAuth
  private readonly BATCH_SIZE = 1000
  private readonly pubSubClient: PubSub
  private readonly MAX_RETRIES = 3

  constructor(googleAuth = null) {
    this.googleAuth =
      googleAuth ||
      new GoogleAuth({
        ...(process.env.GCP_EVENTS_EMAIL &&
          process.env.GCP_PRIVATE_KEY && {
            credentials: {
              client_email: process.env.GCP_EVENTS_EMAIL,
              private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
          }),
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      })

    this.pubSubClient = new PubSub({ projectId: process.env.GCP_EVENTS_PROJECT })
  }

  async validate(attributes: PubSubAttributeDto): Promise<void> {
    try {
      const attributesPubSubDto = new PubSubAttributeDto(attributes)

      await validateOrReject(attributesPubSubDto)
    } catch (error) {
      const throwError = Array.isArray(error) ? this.formatValidationError(error) : error

      throw new ValidationAttributeError(throwError)
    }
  }

  private formatValidationError(error: ValidationError[]): object {
    let objectError = {}
    for (const item of error) {
      for (const key in item.constraints) {
        if (key) {
          objectError = {
            message: item.constraints[key],
            ...(item.value && { informedValue: item.value }),
          }
        }
      }
    }
    return objectError
  }

  async publish(attributes: PubSubAttributeDto, body: object, url: string): Promise<void> {
    const pubSubClient = await this.googleAuth.getClient()
    const defaultAttributes = { created_at: String(Date.now()) }
    let retries = 0

    while (retries < this.MAX_RETRIES) {
      try {
        await pubSubClient.request({
          url,
          method: 'POST',
          data: {
            messages: [
              {
                data: Buffer.from(JSON.stringify(body)).toString('base64'),
                attributes: { ...defaultAttributes, ...attributes },
              },
            ],
          },
        })

        return
      } catch (error) {
        retries++
        if (retries >= this.MAX_RETRIES) {
          // eslint-disable-next-line no-console
          console.error(`Error to publish event: ${error}`)

          throw new PublishPubSubError(error)
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }

  async publishInBatch(attributes: PubSubAttributeDto, messages: object[]): Promise<void> {
    if (messages.length > this.BATCH_SIZE)
      throw new PublishPubSubError({ code: 400, message: 'Exceeded maximum events limit' })

    const defaultAttributes = { created_at: String(Date.now()) }

    const batchPublisher = this.pubSubClient.topic('events', {
      batching: {
        maxMessages: this.BATCH_SIZE,
      },
    })

    await Promise.all(
      messages.map((message) => {
        batchPublisher.publishMessage({
          attributes: { ...defaultAttributes, ...attributes },
          data: Buffer.from(JSON.stringify(message)),
        })
      }),
    )
  }

  async publishEventsInBatch(events: PubSubEvent[]): Promise<void> {
    if (events.length > this.BATCH_SIZE)
      throw new PublishPubSubError({ code: 400, message: 'Exceeded maximum events limit' })

    const batchPublisher = this.pubSubClient.topic('cold-events', {
      batching: {
        maxMessages: this.BATCH_SIZE,
      },
    })

    await Promise.all(
      events.map((event) => {
        batchPublisher.publishMessage({
          attributes: event.attributes,
          data: Buffer.from(JSON.stringify(event.body)),
        })
      }),
    )
  }
}
