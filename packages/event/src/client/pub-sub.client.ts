import { GoogleAuth } from 'google-auth-library'
import { Logger } from '@nestjs/common'
import { validateOrReject } from 'class-validator'
import { EventClientInterface } from '../interface'
import { PubSubAttributesDto } from '../dto'
import { PublishPubSubError, ValidationAttributesError } from '../error'

export class PubSubClient implements EventClientInterface {
  private readonly googleAuth: GoogleAuth

  constructor(googleAuth = null) {
    this.googleAuth =
      googleAuth ||
      new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      })
  }

  async validate(attributes: PubSubAttributesDto): Promise<void> {
    try {
      const attributesPubSubDto = new PubSubAttributesDto(attributes)

      await validateOrReject(attributesPubSubDto)
    } catch (error) {
      Logger.error(`Error on trying to validation attributes ${error}`)

      throw new ValidationAttributesError(error)
    }
  }

  async publish(attributes: PubSubAttributesDto, body: object): Promise<void> {
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

      throw new PublishPubSubError(error)
    }
  }
}
