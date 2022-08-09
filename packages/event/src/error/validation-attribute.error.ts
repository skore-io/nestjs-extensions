import { CodedError } from './coded.error'

export class ValidationAttributeError extends CodedError {
  constructor() {
    super('VALIDATION_FAILED', 'Invalid attributes data')
  }
}
