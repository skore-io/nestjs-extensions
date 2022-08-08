export enum PubSubTypeEventEnum {
  Content = 'io.skore.events.content',
  Session = 'io.skore.events.session',
  Enrollment = 'io.skore.events.enrollment',
  User = 'io.skore.events.user',
  Team = 'io.skore.events.team',
}

export enum PubSubTypeMessageEnum {
  Message = 'io.skore.events.messaging.message',
  Postback = 'io.skore.events.messaging.postback',
  Conversation = 'io.skore.events.messaging.conversation',
  Intent = 'io.skore.events.messaging.intent',
}

export enum PubSubTypeCommandEnum {
  Outbound = 'io.skore.commands.outbound',
}

export enum PubSubActionEnum {
  Accessed = 'accessed',
  PartialConsumed = 'partial_consumed',
  Consumed = 'consumed',
  Completed = 'completed',
  Deleted = 'deleted',
  Search = 'search',
  Reseted = 'reseted',
  Commented = 'commented',
  Ping = 'ping',
  Delivered = 'delivered',
  Received = 'received',
  Read = 'read',
  Sent = 'sent',
  Triggered = 'triggered',
  SendNotification = 'send_notification',
}
