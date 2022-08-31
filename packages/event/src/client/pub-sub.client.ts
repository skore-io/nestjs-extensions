import { GoogleAuth } from 'google-auth-library'
import { validateOrReject, ValidationError } from 'class-validator'
import { EventClientInterface } from '../interface'
import { PubSubAttributeDto } from '../dto'
import { PublishPubSubError, ValidationAttributeError } from '../error'

export class PubSubClient implements EventClientInterface {
  private readonly googleAuth: GoogleAuth

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
      const errorsValidations: ValidationError[] = error
      let objectError = {}
      for (const item of errorsValidations) {
        for (const key in item.constraints) {
          if (key) {
            objectError = {
              message: item.constraints[key],
              ...(item.value && { informedValue: item.value }),
            }
          }
        }
      }

      throw new ValidationAttributeError(objectError)
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
      throw new PublishPubSubError(error)
    }
  }
}
