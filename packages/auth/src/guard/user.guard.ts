import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { processRequest } from '../util'

@Injectable()
export class UserGuard extends AuthGuard('user') {
  getRequest<T = Request>(context: ExecutionContext): T {
    return processRequest(context) as T
  }
}
