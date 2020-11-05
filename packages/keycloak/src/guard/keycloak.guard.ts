import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { PROTECTED } from '../constants'

@Injectable()
export class KeycloakGuard extends AuthGuard('keycloak') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  getRequest(context: ExecutionContext): unknown {
    const isRest = context.getType() === 'http'

    const request = isRest
      ? context.switchToHttp().getRequest()
      : GqlExecutionContext.create(context).getContext().req

    request.isRest = isRest
    const handler = context.getHandler()

    const hasProtectedDecorator = this.reflector.get<boolean>(PROTECTED, handler)

    if (hasProtectedDecorator) {
      request.protectionType = PROTECTED
    }

    return request
  }
}
