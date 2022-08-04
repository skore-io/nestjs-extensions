import { suite, test } from '@testdeck/jest'
import { EventName, getClient, PubSubClient } from '../../src/client'

@suite('[Client Module]')
export class GetClientTest {
  @test()
  'Get client PubSub with succeffully'() {
    const client = getClient(EventName.PubSub, new PubSubClient())

    expect(client).toBeInstanceOf(PubSubClient)
  }
}
