import { ContentEvent, UserEvents } from './'

export type ContentAccessedEvent = ContentEvent &
  UserEvents & {
    element_type?: 'content'
    element_action?: 'accessed'
  }
