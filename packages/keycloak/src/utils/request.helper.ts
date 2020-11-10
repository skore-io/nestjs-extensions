import { ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export class RequestHelper {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  static getTypedRequest(context: ExecutionContext): any {
    const isRest = context.getType() === 'http'
    const request = isRest
      ? context.switchToHttp().getRequest()
      : GqlExecutionContext.create(context).getContext().req

    request.isRest = isRest

    return request
  }
}
