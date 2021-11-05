import { ExecutionContext } from '@nestjs/common'

export const getRequestFromContext = (context: ExecutionContext) => {
  const graphqlReq = context.getArgByIndex(2).req

  return !!graphqlReq ? graphqlReq : context.switchToHttp().getRequest()
}
