import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { authorizationHeader } from '.'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRequestFromContext = (context: ExecutionContext): any => {
  const graphqlReq = context.getArgByIndex(2).req

  return graphqlReq || context.switchToHttp().getRequest()
}

export const processRequest = (context: ExecutionContext): Request => {
  const request = getRequestFromContext(context)
  const token = authorizationHeader(request.headers)

  if (!token) throw new UnauthorizedException()

  request.context = context

  return request
}
