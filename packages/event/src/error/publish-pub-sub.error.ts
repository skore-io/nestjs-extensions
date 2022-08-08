import { CodedError } from './coded.error'

export class PublishPubSubError extends CodedError {
  constructor(details: Error) {
    super('PUBLISH_PUBSUB_FAILED', 'fail to publish event', details)
  }
}
