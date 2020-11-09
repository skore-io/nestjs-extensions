import { Injectable, Logger } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ForbiddenError } from 'apollo-server-express'
import { Strategy } from 'passport-http-bearer'
import { PROTECTED } from '../constants'
import { FindUserService } from '../service'
import { KeycloakUtils } from '../utils'

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  constructor(private readonly findUserService: FindUserService) {
    super({ passReqToCallback: true })
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async validate(req: any, token: string): Promise<boolean> {
    try {
      const type = req.protectionType as string
      const realm = this.realmFromToken(token)
      if (type && type === PROTECTED) {
        req.user = await this.findUserService.perform(realm, token)
      }

      return true
    } catch (error) {
      Logger.debug(`Invalid token message=${error.message}`, KeycloakStrategy.name)

      if (req.isRest) return false

      throw new ForbiddenError(error.message)
    }
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  private realmFromToken(token: string): string {
    return KeycloakUtils.realmFromToken(token)
  }
}
