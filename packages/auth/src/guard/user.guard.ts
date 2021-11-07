import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { authorizationHeader, getRequestFromContext } from '../util'

@Injectable()
export class UserGuard extends AuthGuard('user') {
  getRequest(context: ExecutionContext): Request {
    const request = getRequestFromContext(context)
    const token = authorizationHeader(request.headers)

    if (!token) throw new ForbiddenException()

    request.context = context

    return request
  }
}
