export abstract class CodedError extends Error {
  code: string

  details?: Record<string, unknown>

  constructor(code: string, message: string, details?: Record<string, unknown>) {
    super(message)
    this.code = code
    this.details = details
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      details: this.details,
    }
  }
}
