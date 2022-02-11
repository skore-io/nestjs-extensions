import { ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GoogleAuthGuard extends AuthGuard('GoogleAuth') {
  getRequest(context: ExecutionContext): Request {
    const graphqlReq = context.getArgByIndex(2).req
    const request = graphqlReq || context.switchToHttp().getRequest()

    request.context = context

    return request
  }
}
