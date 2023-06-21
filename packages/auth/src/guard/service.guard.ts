import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { processRequest } from '../util'
import { Request } from 'express'

@Injectable()
export class ServiceGuard extends AuthGuard('service') {
  getRequest<T = Request>(context: ExecutionContext): T {
    return processRequest(context) as T
  }
}
