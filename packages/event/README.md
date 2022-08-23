# Event

Lib to send events according to the selected client

## Installation

```bash
npm i @skore-io/event
```

## PubSub

### Setup

Set environment variables in the project

```sh
GCP_EVENTS_PROJECT_URL='https://pubsub.googleapis.com/v1/projects/skore-events-staging/topics/events:publish'
GOOGLE_APPLICATION_CREDENTIALS='gcloud-service-account.json'
```

**\*gcloud-service-account.json**: json file must be in root project\*

### Usage

import and create attributes

```typescript
import {
  SendEventService,
  PubSubAttributeDto,
  PubSubActionEnum,
  PubSubTypeEventEnum,
  ClientEventNameEnum,
} from '@skore-io/event'
```

```typescript
const attributes: PubSubAttributeDto = {
  action: PubSubActionEnum.send_notification,
  source: 'workspace:yolo.ts',
  type: PubSubTypeEventEnum['io.skore.commands.integration'],
}
```

Create instance for the send event class

```typescript
    try {
      const sendEvent = new SendEventService(ClientEventNameEnum.PubSub)
```

Call method "perform" with attributes and body

```typescript
      const body = {
         test: 'yolo',
      }

      await sendEvent.perform(attributes, body)

      this.logger.log(`New message send with succeffully!`)
    } catch (error) {
      this.logger.error(error)
    }
```
