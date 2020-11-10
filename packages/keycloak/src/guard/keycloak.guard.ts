import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { PROTECTED } from '../constants'
import { RequestHelper } from '../utils'

@Injectable()
export class KeycloakGuard extends AuthGuard('keycloak') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  getRequest(context: ExecutionContext): unknown {
    const request = RequestHelper.getTypedRequest(context)

    const hasProtectedDecorator = this.reflector.get<boolean>(PROTECTED, context.getHandler())

    if (hasProtectedDecorator) {
      request.protectionType = PROTECTED
    }

    return request
  }
}
