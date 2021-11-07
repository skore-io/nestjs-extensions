import { ExecutionContext } from '@nestjs/common'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRequestFromContext = (context: ExecutionContext): any => {
  const graphqlReq = context.getArgByIndex(2).req

  return !!graphqlReq ? graphqlReq : context.switchToHttp().getRequest()
}
