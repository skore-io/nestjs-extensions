/**
 * Basic validation for a content accessed event.
 */
export interface FeedbackFormV1 {
  /**
   * Unique identifier for the feedback form.
   */
  id: string
  /**
   * Feedback form title.
   */
  title: 'CONTENT' | 'MISSION_STAGE' | 'LIVE_CLASS'
  /**
   * Unique identifier for the company associated with the feedback form.
   */
  companyId: number
  /**
   * Feedback form version.
   */
  version: number
  /**
   * Time at which the feedback form was created.
   */
  createdAt: number
  /**
   * Time at which the feedback form was updated.
   */
  updatedAt: number
  /**
   * Time at which the feedback form was deleted.
   */
  deletedAt: number
}
