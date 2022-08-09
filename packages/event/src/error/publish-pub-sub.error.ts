import { CodedError } from './coded.error'

export class PublishPubSubError extends CodedError {
  constructor() {
    super('PUBLISH_PUBSUB_FAILED', 'fail to publish event')
  }
}
