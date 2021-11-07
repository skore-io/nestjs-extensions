import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { getRequestFromContext } from '../util'

export const CurrentUser = createParamDecorator(
  (_params: unknown, context: ExecutionContext) => getRequestFromContext(context).user,
)
