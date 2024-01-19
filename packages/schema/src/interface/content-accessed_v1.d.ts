export type ContentAccessedEvent = ContentEvent &
  UserEvents & {
    element_type?: 'content'
    element_action?: 'accessed'
    [k: string]: unknown
  }
