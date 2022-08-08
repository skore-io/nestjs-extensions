import { suite, test } from '@testdeck/jest'
import { PubSubActionEnum, PubSubTypeEventEnum } from '../../src/enum'
import { PubSubClient } from '../../src/client'
import { PubSubAttributeDto } from '../../src'
import { ValidationAttributeError, PublishPubSubError } from '../../src/error'

@suite('[Event Client] - PubSubClient')
export class GetClientTest {
  @test()
  async 'Should publish event at Pub Sub with successfully'() {
    process.env.GCP_EVENTS_PROJECT_URL = 'https://bilu.com.br/yolo'

    const request = jest.fn().mockResolvedValue(undefined)
    const getClient = jest.fn().mockResolvedValue({ request })
    const dataFake = Date.now()
    jest.spyOn(Date, 'now').mockImplementation(() => dataFake)

    const pubSubClient = new PubSubClient({ getClient })

    const pubSubAttributeFake: PubSubAttributeDto = {
      action: PubSubActionEnum.Sent,
      type: PubSubTypeEventEnum.Conversation,
      source: 'workspace:???.ts',
    }

    const bodyFake = {}

    await pubSubClient.publish(pubSubAttributeFake, bodyFake)

    const defaultAttributes = { createdAt: String(Date.now()) }

    expect(getClient).toHaveBeenCalledTimes(1)
    expect(request).toHaveBeenCalledWith({
      url: `https://bilu.com.br/yolo`,
      method: 'POST',
      data: {
        messages: [
          {
            data: Buffer.from(JSON.stringify(bodyFake)).toString('base64'),
            attributes: { ...defaultAttributes, ...pubSubAttributeFake },
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

    const pubSubClient = new PubSubClient({ getClient })

    const attributePubSubDtoFake: PubSubAttributeDto = {
      action: PubSubActionEnum.Accessed,
      type: PubSubTypeEventEnum.Outbound,
      source: 'workspace:???.ts',
    }

    const bodyFake = {}

    let err = null
    try {
      await pubSubClient.publish(attributePubSubDtoFake, bodyFake)
    } catch (error) {
      err = error
    }

    expect(getClient).toHaveBeenCalledTimes(1)
    expect(err).toBeInstanceOf(PublishPubSubError)
    expect((err as PublishPubSubError).code).toEqual('PUBLISH_PUBSUB_FAILED')
    expect((err as PublishPubSubError).message).toEqual('fail to publish event')
  }

  @test()
  async 'Should throw ValidationAttributeError at validate attributes'() {
    const getClient = {}

    const pubSubClient = new PubSubClient({ getClient })

    const attributePubSubDtoFake = {
      action: 'yolo',
      gcp_events_project: 1,
      source: 'workspace:???.ts',
    }

    let err = null
    try {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      await pubSubClient.validate(attributePubSubDtoFake)
    } catch (error) {
      err = error
    }

    expect(err).toBeInstanceOf(ValidationAttributeError)
    expect((err as ValidationAttributeError).code).toEqual('VALIDATION_FAILED')
    expect((err as ValidationAttributeError).message).toEqual('Invalid attributes data')
  }
}
