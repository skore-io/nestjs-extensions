# Description

Lib to send events according to the selected client

## Installation

```bash
npm i @skore-io/event
```

## PubSub

### Setup

1. Set environment variables in the project

```sh
GCP_EVENTS_PROJECT_URL='https://pubsub.googleapis.com/v1/projects/{{project_name}}/topics/events:publish'
GOOGLE_APPLICATION_CREDENTIALS='gcloud-service-account.json'
```

**\*gcloud-service-account.json**: json file must be in root project\*

### Usage

1. import and create attributes

```typescript
import {
  EventService,
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

2. Create an instance of the EventService class with enum client name

```typescript
const sendEvent = new EventService(ClientEventNameEnum.PubSub)
```

3. Call method "perform" with attributes and body to send event

```typescript
const body = {
  test: 'yolo',
}

await sendEvent.perform(attributes, body)
```
