import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { processRequest } from '../util'

@Injectable()
export class ServiceGuard extends AuthGuard('service') {
  getRequest(context: ExecutionContext): Request {
    return processRequest(context)
  }
}
