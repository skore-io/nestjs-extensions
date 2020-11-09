import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '../domain'
import { RequestHelper } from '../utils'

export const GetUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request = RequestHelper.getRequest(context)
    return request.user
  },
)
