import { Logger } from '@nestjs/common'
import { suite, test } from '@testdeck/jest'
import { PubSubActionEnum, PubSubTypeEnum } from '../../src/enum/pub-sub'
import { PubSubClient } from '../../src/client/pub-sub'
import { PubSubAttributes } from '../../src/dto/pub-sub'

@suite('[Event Module] - PubSubClient')
export class GetClientTest {
  @test()
  async 'Should publish event at Pub Sub with successfully'() {
    const request = jest.fn().mockResolvedValue(undefined)
    const getClient = jest.fn().mockResolvedValue({ request })
    const dataFake = Date.now()
    jest.spyOn(Date, 'now').mockImplementation(() => dataFake)

    const pubSubClient = new PubSubClient({ getClient })

    const pubSubAttributesFake: PubSubAttributes = {
      action: PubSubActionEnum.Accessed,
      gcp_events_project: 'skore-events-staging',
      type: PubSubTypeEnum.Team,
      source: 'workspace:???.ts',
    }

    const bodyFake = {}

    await pubSubClient.publish(pubSubAttributesFake, bodyFake)

    const defaultAttributes = { created_at: String(Date.now()) }

    expect(getClient).toHaveBeenCalledTimes(1)
    expect(request).toHaveBeenCalledWith({
      url: `https://pubsub.googleapis.com/v1/projects/${pubSubAttributesFake.gcp_events_project}/topics/events:publish`,
      method: 'POST',
      data: {
        messages: [
          {
            data: Buffer.from(JSON.stringify(bodyFake)).toString('base64'),
            attributes: { ...defaultAttributes, ...pubSubAttributesFake },
          },
        ],
      },
    })
  }

  @test()
  async 'Should throw error to publish event'() {
    const errorFake = new Error('yolo error')
    const request = jest.fn().mockRejectedValue(errorFake)
    const getClient = jest.fn().mockResolvedValue({ request })
    const dataFake = Date.now()

    jest.spyOn(Date, 'now').mockImplementation(() => dataFake)
    const loggerErrorMock = jest.spyOn(Logger, 'error').mockImplementation(() => undefined)

    const pubSubClient = new PubSubClient({ getClient })

    const attributesPubSubDtoFake: PubSubAttributes = {
      action: PubSubActionEnum.Accessed,
      gcp_events_project: 'skore-events-staging',
      type: PubSubTypeEnum.Team,
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
