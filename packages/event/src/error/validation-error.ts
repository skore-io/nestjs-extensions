import { ValidationError } from 'class-validator'
import { CodedError } from './error'

export class ValidationAttributesError extends CodedError {
  constructor(details: ValidationError[]) {
    super('VALIDATION_FAILED', 'Invalid attributes data', details as ValidationError[])
  }
}
