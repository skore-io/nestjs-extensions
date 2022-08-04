import { suite, test } from '@testdeck/jest'
import { SendEvent, AttributesActionEnum, AttributesTypeEnum } from '..'
import { EventName, PubSubClient } from '../src/client'

@suite('[Event Module]')
export class SendEventTest {
  @test()
  async 'Call perform with pubsub client with succeffully'() {
    const clientFake = jest
      .spyOn(PubSubClient.prototype, 'publish')
      .mockImplementation(() => undefined)

    const sendEvent = await new SendEvent(EventName.PubSub)

    const dtoFake = {
      gcp_events_project: 'skore-events-staging',
      action: AttributesActionEnum.Accessed,
      created_at: Date.now(),
      source: 'workspace:???.ts',
      type: AttributesTypeEnum.Content,
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
