import { suite, test } from '@testdeck/jest'
import { PubSubClient } from '../../src/client/pub-sub'
import { ClientEventName } from '../../src/enum/client'
import { PerformDto } from '../../src/dto/send-event'
import { SendEvent } from '../../src/service/send-event'
import { PubSubActionEnum, PubSubTypeEnum } from '../../src/enum/pub-sub'

@suite('[Event Module - SendEvent]')
export class SendEventTest {
  @test()
  async 'Call perform with pubsub client with succeffully'() {
    const clientFake = jest
      .spyOn(PubSubClient.prototype, 'publish')
      .mockImplementation(() => undefined)

    const sendEvent = await new SendEvent(ClientEventName.PubSub)

    const dtoFake: PerformDto = {
      gcp_events_project: 'skore-events-staging',
      action: PubSubActionEnum.Accessed,
      source: 'workspace:???.ts',
      type: PubSubTypeEnum.Content,
    }

    const bodyFake = {
      company_id: '114',
      content_id: '123',
      user_id: '126340',
    }

    await sendEvent.perform(dtoFake, bodyFake)

    expect(clientFake).toBeCalledWith(dtoFake, bodyFake)
  }
}
