import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { getRequestFromContext } from '../util'

export const CurrentCompany = createParamDecorator(
  (_params: unknown, context: ExecutionContext) => getRequestFromContext(context).company,
)
