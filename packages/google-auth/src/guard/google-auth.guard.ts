import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

@Injectable()
export class GoogleAuthGuard extends AuthGuard('GoogleAuth') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const graphqlReq = context.getArgByIndex(2).req
    const request = graphqlReq || context.switchToHttp().getRequest()

    request.context = context

    return super.canActivate(context)
  }
}
