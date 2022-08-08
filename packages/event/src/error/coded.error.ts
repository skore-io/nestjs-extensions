export abstract class CodedError extends Error {
  code: string
  details?: Record<string, any>

  constructor(code: string, message: string, details?: Record<string, any>) {
    super(message)
    this.code = code
    this.details = details
  }
}
