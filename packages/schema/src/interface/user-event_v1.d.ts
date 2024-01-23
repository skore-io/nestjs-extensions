import { Events } from './'

/**
 * Basic validation for a user event. It specifies which user initiated the event and through which session.
 */
export type UserEvents = Events & {
  /**
   * Identifier for the user who initiated the event.
   */
  user_id: number
  meta?: {
    /**
     * Session identifier in which the event occurred, can be null.
     */
    session_id?: string | null
  }
}
