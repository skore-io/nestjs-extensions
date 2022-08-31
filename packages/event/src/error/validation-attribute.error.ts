import { CodedError } from './coded.error'

export class ValidationAttributeError extends CodedError {
  constructor(errorDetails: object) {
    super('VALIDATION_FAILED', 'Invalid attributes data', errorDetails)
  }
}
