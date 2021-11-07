import { HttpException, UnprocessableEntityException } from '@nestjs/common'

export class Error {
  static UNPROCESSABLE_ENTITY: HttpException = new UnprocessableEntityException(
    'UNPROCESSABLE_ENTITY',
  )
}
