/**
 * Basic validation for a content accessed event.
 */
export interface FeedbackFormAnswerV1 {
  /**
   * Unique identifier for the feedback form answer.
   */
  id: string
  /**
   * Feedback form type.
   */
  feedbackableType: 'CONTENT' | 'MISSION_STAGE' | 'LIVE_CLASS'
  /**
   * Unique identifier for the feedback form.
   */
  feedbackableId: string
  /**
   * Unique identifier for the user associated with the feedback form.
   */
  userId: number
  /**
   * Unique identifier for the mission associated with the feedback form.
   */
  missionId?: string
  /**
   * Unique identifier for the live course associated with the feedback form.
   */
  liveCourseId?: string
}
