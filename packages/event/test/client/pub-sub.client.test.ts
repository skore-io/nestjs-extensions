import * as validator from 'class-validator'
import { suite, test } from '@testdeck/jest'
import { PubSubActionEnum, PubSubTypeEventEnum } from '../../src/enum'
import { PubSubClient } from '../../src/client'
import { PubSubAttributeDto } from '../../src'
import { ValidationAttributeError, PublishPubSubError } from '../../src/error'
import { PubSub } from '@google-cloud/pubsub'

@suite('[Event Client] - PubSubClient')
export class GetClientTest {
  @test
  async '[publish] Should publish event at Pub Sub with successfully'() {
    process.env.GCP_EVENTS_PROJECT_URL = 'https://bilu.com.br/yolo'

    const request = jest.fn().mockResolvedValue(undefined)
    const getClient = jest.fn().mockResolvedValue({ request })
    const dataFake = Date.now()
    jest.spyOn(Date, 'now').mockImplementation(() => dataFake)

    const pubSubClient = new PubSubClient({ getClient })

    const pubSubAttributeFake: PubSubAttributeDto = {
      action: PubSubActionEnum.sent,
      type: PubSubTypeEventEnum['io.skore.events.messaging.conversation'],
      source: 'workspace:???.ts',
    }

    const bodyFake = {}

    await pubSubClient.publish(pubSubAttributeFake, bodyFake, 'https://bilu.com.br/yolo')

    const defaultAttributes = { created_at: String(Date.now()) }

    expect(getClient).toHaveBeenCalledTimes(1)
    expect(request).toHaveBeenCalledWith({
      url: 'https://bilu.com.br/yolo',
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

  @test
  async '[publish] Should publish event at Pub Sub with different environment variable'() {
    process.env.GCP_EVENTS_PROJECT_URL = 'https://bilu.com.br/yolo'

    const request = jest.fn().mockResolvedValue(undefined)
    const getClient = jest.fn().mockResolvedValue({ request })
    const dataFake = Date.now()
    jest.spyOn(Date, 'now').mockImplementation(() => dataFake)

    const pubSubClient = new PubSubClient({ getClient })

    const pubSubAttributeFake: PubSubAttributeDto = {
      action: PubSubActionEnum.sent,
      type: PubSubTypeEventEnum['io.skore.events.messaging.conversation'],
      source: 'workspace:???.ts',
    }

    const bodyFake = {}

    await pubSubClient.publish(pubSubAttributeFake, bodyFake, 'https://test.com')

    const defaultAttributes = { created_at: String(Date.now()) }

    expect(getClient).toHaveBeenCalledTimes(1)
    expect(request).toHaveBeenCalledTimes(1)
    expect(request).toHaveBeenCalledWith({
      url: 'https://test.com',
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

  @test
  async '[publish] Should throw error to publish event'() {
    const errorFake = new Error('yolo error')
    const request = jest.fn().mockRejectedValue(errorFake)
    const getClient = jest.fn().mockResolvedValue({ request })

    const pubSubClient = new PubSubClient({ getClient })

    const attributePubSubDtoFake: PubSubAttributeDto = {
      action: PubSubActionEnum.accessed,
      type: PubSubTypeEventEnum['io.skore.commands.outbound'],
      source: 'workspace:???.ts',
    }

    const bodyFake = {}

    let err = null
    try {
      await pubSubClient.publish(attributePubSubDtoFake, bodyFake, null)
    } catch (error) {
      err = error
    }

    expect(getClient).toHaveBeenCalledTimes(1)
    expect(err).toBeInstanceOf(PublishPubSubError)
    expect((err as PublishPubSubError).code).toEqual('PUBLISH_PUBSUB_FAILED')
    expect((err as PublishPubSubError).message).toEqual('fail to publish event')
    expect((err as PublishPubSubError).details).toEqual(errorFake)
  }

  @test
  async '[publish] Should retry three times to publish event'() {
    const errorFake = new Error('yolo error')
    const request = jest
      .fn()
      .mockRejectedValueOnce(errorFake)
      .mockRejectedValueOnce(errorFake)
      .mockResolvedValue(undefined)

    const getClient = jest.fn().mockResolvedValue({ request })

    const pubSubClient = new PubSubClient({ getClient })

    const attributePubSubDtoFake: PubSubAttributeDto = {
      action: PubSubActionEnum.accessed,
      type: PubSubTypeEventEnum['io.skore.commands.outbound'],
      source: 'workspace:???.ts',
    }

    const bodyFake = {}

    let err = null
    try {
      await pubSubClient.publish(attributePubSubDtoFake, bodyFake, null)
    } catch (error) {
      err = error
    }

    expect(getClient).toHaveBeenCalledTimes(1)
    expect(request).toHaveBeenCalledTimes(3)
    expect(err).toBeNull()
  }

  @test
  async '[publishEventsInBatch] Should publish batch of events in PubSub with successfully'() {
    process.env.GCP_EVENTS_PROJECT_URL = 'https://bilu.com.br/yolo'

    const pubSubClient = new PubSubClient()

    const publishMessageSpy = jest.fn()

    jest
      .spyOn(PubSub.prototype, 'topic')
      .mockImplementation(() => ({ publishMessage: publishMessageSpy } as never))

    const createdAt = Date.now()

    const events = [
      {
        attributes: {
          action: PubSubActionEnum.sent,
          type: PubSubTypeEventEnum['io.skore.events.messaging.conversation'],
          source: 'file.ts',
          created_at: String(createdAt),
        },
        body: { user_id: '1234' },
      },
      {
        attributes: {
          action: PubSubActionEnum.completed,
          type: PubSubTypeEventEnum['io.skore.events.content'],
          source: 'file2.ts',
          created_at: String(createdAt),
        },
        body: { user_id: '1234', content_id: '4321' },
      },
    ]

    await pubSubClient.publishEventsInBatch(events)

    expect(publishMessageSpy).toHaveBeenCalledTimes(2)
    expect(publishMessageSpy).toHaveBeenNthCalledWith(1, {
      attributes: {
        action: PubSubActionEnum.sent,
        created_at: String(createdAt),
        source: 'file.ts',
        type: 'io.skore.events.messaging.conversation',
      },
      data: expect.any(Buffer),
    })
    expect(publishMessageSpy).toHaveBeenNthCalledWith(2, {
      attributes: {
        action: PubSubActionEnum.completed,
        created_at: String(createdAt),
        source: 'file2.ts',
        type: 'io.skore.events.content',
      },
      data: expect.any(Buffer),
    })
  }

  @test
  async '[publishEventsInBatch] Given an array with more than 1000 items, then throw error'() {
    const pubSubClient = new PubSubClient()

    const mockArray = []
    mockArray.length = 1001

    await expect(pubSubClient.publishEventsInBatch(mockArray)).rejects.toThrow(
      'fail to publish event',
    )
  }

  @test
  async 'Should throw ValidationAttributeError at validate attributes'() {
    const getClient = {}

    const pubSubClient = new PubSubClient({ getClient })

    const attributePubSubDtoFake = {
      action: 'yolo',
      type: PubSubTypeEventEnum['io.skore.events.messaging.conversation'],
      source: 'workspace:???.ts',
    }

    let err = null
    try {
      await pubSubClient.validate(attributePubSubDtoFake as never)
    } catch (error) {
      err = error
    }

    expect(err).toBeInstanceOf(ValidationAttributeError)
    expect((err as ValidationAttributeError).code).toEqual('VALIDATION_FAILED')
    expect((err as ValidationAttributeError).details).toEqual({
      message: `action must be one of the following values: ${Object.values(PubSubActionEnum).join(
        ', ',
      )}`,
      informedValue: 'yolo',
    })
  }

  @test
  async '[validate] Should throw ValidationAttributeError at validate attributes empty '() {
    const getClient = {}

    const pubSubClient = new PubSubClient({ getClient })

    const attributePubSubDtoFake = {
      type: PubSubTypeEventEnum['io.skore.events.messaging.conversation'],
      source: 'workspace:???.ts',
    }

    let err = null
    try {
      await pubSubClient.validate(attributePubSubDtoFake as never)
    } catch (error) {
      err = error
    }

    expect(err).toBeInstanceOf(ValidationAttributeError)
    expect((err as ValidationAttributeError).code).toEqual('VALIDATION_FAILED')
    expect((err as ValidationAttributeError).details).toEqual({
      message: 'action should not be empty',
    })
  }

  @test
  async '[validate] Should throw internal error '() {
    const errorFake = new Error('yolo')
    jest.spyOn(validator, 'validateOrReject').mockRejectedValue(errorFake)

    const getClient = {}

    const pubSubClient = new PubSubClient({ getClient })

    const attributePubSubDtoFake = {
      type: PubSubTypeEventEnum['io.skore.events.messaging.conversation'],
      source: 'workspace:???.ts',
    }

    let err = null
    try {
      await pubSubClient.validate(attributePubSubDtoFake as never)
    } catch (error) {
      err = error
    }

    expect(err).toBeInstanceOf(ValidationAttributeError)
    expect((err as ValidationAttributeError).code).toEqual('VALIDATION_FAILED')
    expect((err as ValidationAttributeError).message).toEqual('Invalid attributes data')
    expect((err as ValidationAttributeError).details).toEqual(errorFake)
  }
}
