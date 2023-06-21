import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { processRequest } from '../util'
import { Observable } from 'rxjs'

@Injectable()
export class UserGuard extends AuthGuard('user') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    processRequest(context)

    return super.canActivate(context)
  }
}
