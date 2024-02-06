/**
 * Basic validation for a users created event.
 */
export interface UserCreatedEventV1 {
  attributes?: {
    action: 'created'
    type: 'io.skore.events.user'
    /**
     * The source where the event originated.
     */
    source: string
  }
  body?: {
    /**
     * Unique identifier for the user associated with the event.
     */
    element_id: number
    /**
     * Unique identifier for the company associated with the event.
     */
    company_id: number
    /**
     * User identifier in which the event occurred.
     */
    user_id: string
    /**
     * Role of the user who performed the action.
     */
    role: string
    /**
     * User who performed the action.
     */
    performer_id: string
    /**
     * Extra information for audit.
     */
    metadata: {}
  }
}
