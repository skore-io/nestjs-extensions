import { Events } from './'

/**
 * Events related to content must have a specific content associated. This includes the type of content and the action taken on it.
 */
export type ContentEvent = Events & {
  /**
   * Type of action taken on the content (e.g., accessed, consumed).
   */
  element_action: 'accessed' | 'consumed' | 'completed' | 'attended'
  /**
   * Type of the content element (e.g., content, mission, space).
   */
  element_type: 'content' | 'mission' | 'space'
  /**
   * Unique identifier for the content element.
   */
  element_id: string
}
