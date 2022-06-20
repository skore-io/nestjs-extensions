import { Logger } from '@nestjs/common'

export const authorizationHeader = (headers: { authorization: string }): string => {
  const authHeader = headers.authorization as string

  if (!authHeader) {
    Logger.error('Authorization header not found.')
    return null
  }

  const [type, token] = authHeader.split(' ')

  if (type !== 'Bearer') {
    Logger.error(`Authentication type \'Bearer\' required. Found \'${type}\'`)
    return null
  }

  return token
}
