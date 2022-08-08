import { GoogleAuth } from 'google-auth-library'
import { Logger } from '@nestjs/common'
import { validateOrReject } from 'class-validator'
import { EventClientInterface } from '../interface'
import { PubSubAttributeDto } from '../dto'
import { PublishPubSubError, ValidationAttributeError } from '../error'

export class PubSubClient implements EventClientInterface {
  private readonly googleAuth: GoogleAuth
  private readonly logger: Logger = new Logger(PubSubClient.name)

  constructor(googleAuth = null) {
    this.googleAuth =
      googleAuth ||
      new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      })
  }

  async validate(attributes: PubSubAttributeDto): Promise<void> {
    try {
      const attributesPubSubDto = new PubSubAttributeDto(attributes)

      await validateOrReject(attributesPubSubDto)
    } catch (error) {
      this.logger.error(`Error on trying to validate attributes ${error}`)

      throw new ValidationAttributeError(error)
    }
  }

  async publish(attributes: PubSubAttributeDto, body: object): Promise<void> {
    const pubSubClient = await this.googleAuth.getClient()
    const defaultAttributes = { createdAt: String(Date.now()) }

    try {
      await pubSubClient.request({
        url: process.env.GCP_EVENTS_PROJECT_URL,
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
      this.logger.error(`Error on trying to publish event=${error}`)

      throw new PublishPubSubError(error)
    }
  }
}
