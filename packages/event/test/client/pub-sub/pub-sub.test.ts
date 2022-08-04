import { Logger } from '@nestjs/common'
import { suite, test } from '@testdeck/jest'
import {
  AttributesPubSubDto,
  PubSubClient,
  AttributesActionEnum,
  AttributesTypeEnum,
} from '../../../src/client'

@suite('[PubSubClient Module]')
export class GetClientTest {
  @test()
  async 'Should publish event in Pub Sub with successfully'() {
    const request = jest.fn().mockResolvedValue(undefined)
    const getClient = jest.fn().mockResolvedValue({ request })
    const dataFake = Date.now()
    jest.spyOn(Date, 'now').mockImplementation(() => dataFake)

    const pubSubClient = new PubSubClient({ getClient })

    const attributesPubSubDtoFake: AttributesPubSubDto = {
      action: AttributesActionEnum.Accessed,
      created_at: Date.now(),
      gcp_events_project: 'skore-events-staging',
      type: AttributesTypeEnum.Team,
      source: 'workspace:???.ts',
    }

    const bodyFake = {}

    await pubSubClient.publish(attributesPubSubDtoFake, bodyFake)

    const defaultAttributes = { created_at: String(Date.now()) }

    expect(getClient).toHaveBeenCalledTimes(1)
    expect(request).toHaveBeenCalledWith({
      url: `https://pubsub.googleapis.com/v1/projects/${attributesPubSubDtoFake.gcp_events_project}/topics/events:publish`,
      method: 'POST',
      data: {
        messages: [
          {
            data: Buffer.from(JSON.stringify(bodyFake)).toString('base64'),
            attributes: { ...defaultAttributes, ...attributesPubSubDtoFake },
          },
        ],
      },
    })
  }

  @test()
  async 'Should throw error in publish event'() {
    const errorFake = new Error('yolo error')
    const request = jest.fn().mockRejectedValue(errorFake)
    const getClient = jest.fn().mockResolvedValue({ request })
    const dataFake = Date.now()

    jest.spyOn(Date, 'now').mockImplementation(() => dataFake)
    const loggerErrorMock = jest.spyOn(Logger, 'error').mockImplementation(() => undefined)

    const pubSubClient = new PubSubClient({ getClient })

    const attributesPubSubDtoFake: AttributesPubSubDto = {
      action: AttributesActionEnum.Accessed,
      created_at: Date.now(),
      gcp_events_project: 'skore-events-staging',
      type: AttributesTypeEnum.Team,
      source: 'workspace:???.ts',
    }

    const bodyFake = {}

    let err = null
    try {
      await pubSubClient.publish(attributesPubSubDtoFake, bodyFake)
    } catch (error) {
      err = error
    }

    expect(getClient).toHaveBeenCalledTimes(1)
    expect(err).toBeInstanceOf(Error)
    expect(loggerErrorMock).toBeCalledWith(`Error on trying to publish event=${errorFake}`)
  }
}
