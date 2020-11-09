import { ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export class RequestHelper {
  static getRequest(context: ExecutionContext): unknown {
    const isRest = context.getType() === 'http'
    const request = isRest
      ? context.switchToHttp().getRequest()
      : GqlExecutionContext.create(context).getContext().req

    request.isRest = isRest

    return request
  }
}
