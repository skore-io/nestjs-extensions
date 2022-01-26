import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { getRequestFromContext } from '../util'

export const Current = createParamDecorator(
  (_params: unknown, context: ExecutionContext) => getRequestFromContext(context).current,
)
