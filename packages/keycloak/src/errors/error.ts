import { UnprocessableEntityException } from '@nestjs/common'

export class Error {
  static UNPROCESSABLE_ENTITY = new UnprocessableEntityException('UNPROCESSABLE_ENTITY')
}
