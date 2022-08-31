export abstract class CodedError extends Error {
  code: string
  details?: object

  constructor(code: string, message: string, details?: object) {
    super(message)
    this.code = code
    this.details = details
  }
}
