import { ValidationError } from 'class-validator'
import { CodedError } from './error'

export class ValidationAttributeError extends CodedError {
  constructor(details: ValidationError[]) {
    super('VALIDATION_FAILED', 'Invalid attributes data', details as ValidationError[])
  }
}
