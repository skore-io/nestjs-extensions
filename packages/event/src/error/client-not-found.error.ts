import { CodedError } from './coded.error'

export class ClientNotFoundError extends CodedError {
  constructor() {
    super('CLIENT_NOT_FOUND_ERROR', 'client not found')
  }
}
