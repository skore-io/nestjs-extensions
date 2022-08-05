import { suite, test } from '@testdeck/jest'
import { PubSubClient } from '../../src/client'
import { EventAttributesDto } from '../../src/dto'
import { SendEventService } from '../../src/service'
import { PubSubActionEnum, PubSubTypeEnum, ClientEventNameEnum } from '../../src/enum'

@suite('[Event Module - SendEvent]')
export class SendEventTest {
  @test()
  async 'Call perform with pubsub client with succeffully'() {
    const clientFake = jest
      .spyOn(PubSubClient.prototype, 'publish')
      .mockImplementation(() => undefined)

    const sendEvent = await new SendEventService(ClientEventNameEnum.PubSub)

    const dtoFake: EventAttributesDto = {
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
