import { Injectable, Logger } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ForbiddenError } from 'apollo-server-express'
import { Strategy } from 'passport-http-bearer'
import { PROTECTED } from '../constants'
import { User } from '../domain'
import { FindUserService } from '../service'
import { KeycloakUtils } from '../utils'

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  constructor(private readonly findUserService: FindUserService) {
    super({ passReqToCallback: true })
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async validate(req: any, token: string): Promise<User> {
    let user: User
    const type = req.protectionType as string

    try {
      const realm = this.realmFromToken(token)
      if (type === PROTECTED) {
        user = await this.findUserService.perform(realm, token)
      }

      return user
    } catch (error) {
      Logger.error('Invalid token', error, KeycloakStrategy.name)

      if (req.isRest) return null

      throw new ForbiddenError(error.message)
    }
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  private realmFromToken(token: string): string {
    return KeycloakUtils.realmFromToken(token)
  }
}
