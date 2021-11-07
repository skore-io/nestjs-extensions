import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '../domain'
import { RequestHelper } from '../utils'

export const GetUser = createParamDecorator((_data: unknown, context: ExecutionContext): User => {
  const request = RequestHelper.getTypedRequest(context)
  return request.user
})
