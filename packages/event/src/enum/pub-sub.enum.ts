export enum PubSubTypeEnum {
  Content = 'io.skore.events.content',
  Session = 'io.skore.events.session',
  Enrollment = 'io.skore.events.enrollment',
  User = 'io.skore.events.user',
  Team = 'io.skore.events.team',
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
}
