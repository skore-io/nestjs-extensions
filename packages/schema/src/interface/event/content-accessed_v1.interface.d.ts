/**
 * Basic validation for a content accessed event.
 */
export interface ContentAccessedEventV1 {
  attributes?: {
    action: 'accessed'
    type: 'io.skore.events.content'
    /**
     * Time at which the event occurred.
     */
    created_at: number
    /**
     * The source where the event originated.
     */
    source: string
  }
  body?: {
    /**
     * Unique identifier for the content associated with the event.
     */
    element_id: number
    /**
     * Unique identifier for the company associated with the event.
     */
    company_id: number
    /**
     * Content identifier in which the event occurred, can't be null.
     */
    content_id: string
    /**
     * User identifier in which the event occurred, can't be null.
     */
    user_id: string
  }
}
