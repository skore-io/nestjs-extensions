import { suite, test } from '@testdeck/jest'
import { PubSubClient } from '../../src/client'
import { EventAttributeDto } from '../../src/dto'
import { SendEventService } from '../../src/service'
import { PubSubActionEnum, ClientEventNameEnum, PubSubTypeCommandEnum } from '../../src/enum'
import { ClientNotFoundError } from '../../src/error/client-not-found.error'

@suite('[Event Service - SendEvent]')
export class SendEventTest {
  @test()
  async 'Call perform with pubsub client with succeffully'() {
    const clientFake = jest
      .spyOn(PubSubClient.prototype, 'publish')
      .mockImplementation(() => undefined)

    const sendEvent = await new SendEventService(ClientEventNameEnum.PubSub)

    const dtoFake: EventAttributeDto = {
      action: PubSubActionEnum.Accessed,
      source: 'workspace:???.ts',
      type: PubSubTypeCommandEnum.Outbound,
    }

    const bodyFake = {
      company_id: '114',
      content_id: '123',
      user_id: '126340',
    }

    await sendEvent.perform(dtoFake, bodyFake)

    expect(clientFake).toBeCalledWith(dtoFake, bodyFake)
  }

  @test()
  async 'Should return client not found error'() {
    let err = null
    try {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      await new SendEventService('yolo')
    } catch (error) {
      err = error
    }

    expect(err).toBeInstanceOf(ClientNotFoundError)
  }
}
