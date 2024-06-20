import { suite, test } from '@testdeck/jest'
import { PubSubClient } from '../../src/client'
import { EventAttributeDto } from '../../src/dto'
import { EventService } from '../../src/service'
import { PubSubActionEnum, ClientEventNameEnum, PubSubTypeEventEnum } from '../../src/enum'
import { ClientNotFoundError } from '../../src/error'

@suite
export class EventServiceTest {
  @test
  async '[send] Call send with pubsub client with succeffully'() {
    process.env.GCP_EVENTS_PROJECT_URL = 'https://bilu.com.br/yolo'

    const clientFake = jest
      .spyOn(PubSubClient.prototype, 'publish')
      .mockImplementation(() => undefined)

    const eventService = new EventService(ClientEventNameEnum.PubSub)

    const dtoFake: EventAttributeDto = {
      action: PubSubActionEnum.accessed,
      source: 'workspace:???.ts',
      type: PubSubTypeEventEnum['io.skore.events.content'],
    }

    const bodyFake = {
      company_id: '114',
      content_id: '123',
      user_id: '126340',
    }

    await eventService.send(dtoFake, bodyFake)

    expect(clientFake).toHaveBeenCalledWith(dtoFake, bodyFake, 'https://bilu.com.br/yolo')
  }

  @test
  async '[send] Should call pub sub client with correct url'() {
    process.env.GCP_EVENTS_PROJECT_URL = 'https://bilu.com.br/yolo'

    const clientFake = jest
      .spyOn(PubSubClient.prototype, 'publish')
      .mockImplementation(() => undefined)

    const eventService = new EventService(ClientEventNameEnum.PubSub)

    const dtoFake: EventAttributeDto = {
      action: PubSubActionEnum.accessed,
      source: 'workspace:???.ts',
      type: PubSubTypeEventEnum['io.skore.events.content'],
    }

    const bodyFake = {
      company_id: '114',
      content_id: '123',
      user_id: '126340',
    }

    await eventService.send(dtoFake, bodyFake, 'http://test.com')

    expect(clientFake).toHaveBeenCalledWith(dtoFake, bodyFake, 'http://test.com')
  }

  @test
  async '[publishInBatch] Should call pubsub client with correct data'() {
    process.env.GCP_EVENTS_PROJECT_URL = 'https://bilu.com.br/yolo'

    const clientFake = jest
      .spyOn(PubSubClient.prototype, 'publishEventsInBatch')
      .mockImplementation(() => undefined)

    const eventService = new EventService(ClientEventNameEnum.PubSub)

    const events = [
      {
        attributes: {
          action: PubSubActionEnum.accessed,
          source: 'file.ts',
          type: PubSubTypeEventEnum['io.skore.events.content'],
          created_at: String(Date.now()),
        },
        body: {
          company_id: '114',
          content_id: '123',
          user_id: '126340',
        },
      },
    ]

    await eventService.publishInBatch(events)

    expect(clientFake).toHaveBeenCalledWith(events)
  }

  @test
  async 'Should return client not found error'() {
    let err = null
    try {
      new EventService('yolo' as never)
    } catch (error) {
      err = error
    }

    expect(err).toBeInstanceOf(ClientNotFoundError)
  }
}
