import { CodedError } from './coded.error'

export class PublishPubSubError extends CodedError {
  constructor(errorDetails: object) {
    super('PUBLISH_PUBSUB_FAILED', 'fail to publish event', errorDetails)
  }
}
