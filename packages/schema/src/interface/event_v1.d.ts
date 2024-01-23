/**
 * Basic validation for an event. It must belong to a company and must have a specified source.
 */
export interface Events {
  /**
   * Unique identifier for the company associated with the event.
   */
  company_id: number
  /**
   * Metadata associated with the event.
   */
  meta: {
    /**
     * The source where the event originated.
     */
    source: string
  }
}
