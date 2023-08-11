export enum PubSubTypeEventEnum {
  'io.skore.events.content' = 'io.skore.events.content',
  'io.skore.events.content.live_course' = 'io.skore.events.content.live_course',
  'io.skore.events.session' = 'io.skore.events.session',
  'io.skore.events.enrollment' = 'io.skore.events.enrollment',
  'io.skore.events.user' = 'io.skore.events.user',
  'io.skore.events.team' = 'io.skore.events.team',
  'io.skore.events.messaging.message' = 'io.skore.events.messaging.message',
  'io.skore.events.messaging.postback' = 'io.skore.events.messaging.postback',
  'io.skore.events.messaging.conversation' = 'io.skore.events.messaging.conversation',
  'io.skore.events.messaging.intent' = 'io.skore.events.messaging.intent',
  'io.skore.events.notification' = 'io.skore.events.notification',
  'io.skore.events.user.team' = 'io.skore.events.user.team',
  'io.skore.events.batch' = 'io.skore.events.batch',
  'io.skore.events.invitation' = 'io.skore.events.invitation',
  'io.skore.commands.notification' = 'io.skore.commands.notification',
  'io.skore.commands.outbound' = 'io.skore.commands.outbound',
  'io.skore.commands.integration' = 'io.skore.commands.integration',
  'io.skore.commands.space' = 'io.skore.commands.space',
  'io.skore.commands.user' = 'io.skore.commands.user',
}

export enum PubSubActionEnum {
  send_push = 'send_push',
  attended = 'attended',
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
  base_notification_created = 'base_notification_created',
  base_notification_dispatch = 'base_notification_dispatch',
  created = 'created',
  reindex = 'reindex',
  enrollment_file_uploaded = 'enrollment_file_uploaded',
  enrollment_row_processed = 'enrollment_row_processed',
  attendance_file_uploaded = 'attendance_file_uploaded',
  attendance_row_processed = 'attendance_row_processed',
  delete_sessions = 'delete_sessions',
  added = 'added',
  removed = 'removed',
  row_processed = 'row_processed',
  batch_processed = 'batch_processed',
  indexed = 'indexed',
  updated = 'updated',
  invite = 'invite',
  send_max_seats_email = 'send_max_seats_email',
  leader_added = 'leader_added',
  leader_removed = 'leader_removed',
  canceled = 'canceled',
}
