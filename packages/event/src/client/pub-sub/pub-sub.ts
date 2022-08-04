import { GoogleAuth } from 'google-auth-library'
import { Logger } from '@nestjs/common'
import { AttributesPubSubDto } from '..'
import { EventClient } from '../client'

export class PubSubClient implements EventClient {
  private readonly googleAuth: GoogleAuth

  constructor(googleAuth = null) {
    this.googleAuth =
      googleAuth ||
      new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      })
  }

  async publish(attributes: AttributesPubSubDto, body: object): Promise<void> {
    const pubSubClient = await this.googleAuth.getClient()
    const defaultAttributes = { created_at: String(Date.now()) }

    try {
      await pubSubClient.request({
        url: `https://pubsub.googleapis.com/v1/projects/${attributes.gcp_events_project}/topics/events:publish`,
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
    } catch (error) {
      Logger.error(`Error on trying to publish event=${error}`)
    }
  }
}
