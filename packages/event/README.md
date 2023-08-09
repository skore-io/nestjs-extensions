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

1. Import and create attributes

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
const eventService = new EventService(ClientEventNameEnum.PubSub)
```

3. Call method "send" with attributes and body to send event

```typescript
const body = {
  test: 'yolo',
}

await eventService.send(attributes, body)
```

_If you want to send events in batch, call method "publishInBatch" with an array of attributes and messages_

```typescript
const events = [
  {
    attributes: {
      type: 'io.skore.events.content',
      action: 'attended',
      source: 'file.ts',
      created_at: '1691600045063'
    },
    body: {
      user_id: '3763039',
      company_id: '17157',
      live_class_id: 'd08753a0-ff90-458c-bf8e-48e6f7846b97'
    }
  }
]

await eventService.publishInBatch(events)
```
