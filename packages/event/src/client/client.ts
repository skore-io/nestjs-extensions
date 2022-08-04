import { PubSubClient } from './pub-sub/pub-sub'

export interface EventClient {
  publish(attributes: object, body: object): Promise<void>
}

export enum EventName {
  PubSub = 'pubsub',
}

export function getClient(name: string, client = null): EventClient {
  const clients = {
    pubsub: client || new PubSubClient(),
  }

  return clients[name]
}
