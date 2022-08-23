export enum PubSubTypeEventEnum {
  'io.skore.events.content' = 'io.skore.events.content',
  'io.skore.events.session' = 'io.skore.events.session',
  'io.skore.events.enrollment' = 'io.skore.events.enrollment',
  'io.skore.events.user' = 'io.skore.events.user',
  'io.skore.events.team' = 'io.skore.events.team',
  'io.skore.events.notification' = 'io.skore.events.notification',
  'io.skore.events.messaging.message' = 'io.skore.events.messaging.message',
  'io.skore.events.messaging.postback' = 'io.skore.events.messaging.postback',
  'io.skore.events.messaging.conversation' = 'io.skore.events.messaging.conversation',
  'io.skore.events.messaging.intent' = 'io.skore.events.messaging.intent',
  'io.skore.commands.outbound' = 'io.skore.commands.outbound',
}

export enum PubSubActionEnum {
  accessed = 'accessed',
  partial_consumed = 'partial_consumed',
  consumed = 'consumed',
  completed = 'completed',
  deleted = 'deleted',
  search = 'search',
  reseted = 'reseted',
  commented = 'commented',
  ping = 'ping',
  delivered = 'delivered',
  received = 'received',
  read = 'read',
  sent = 'sent',
  triggered = 'triggered',
  send_notification = 'send_notification',
  created = 'created',
}
