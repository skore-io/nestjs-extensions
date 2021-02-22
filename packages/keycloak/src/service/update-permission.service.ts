import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GetClientToken, UpdatePermissionClient } from '../client'
import { Permission } from '../domain'
import { Error } from '../errors'
import { KeycloakUtils } from '../utils'

@Injectable()
export class UpdatePermissionService {
  constructor(
    private readonly updatePermissionClient: UpdatePermissionClient,
    private readonly getClientToken: GetClientToken,
    private readonly configService: ConfigService,
  ) {}

  async perform(token: string, permission: Permission): Promise<Permission> {
    try {
      await Permission.validate(permission, 'update')

      Logger.log(`Updating permission ${permission.name} in keycloak`, UpdatePermissionService.name)

      const realm = KeycloakUtils.realmFromToken(token)

      const {
        data: { access_token: accessToken },
      } = await this.getClientToken.getClient(
        realm,
        this.configService.get('KEYCLOAK_FOLDER_CLIENT_ID'),
      )

      await this.updatePermissionClient.update(realm, accessToken, permission)

      return permission
    } catch (error) {
      Logger.error('Error on trying to update permission', error, UpdatePermissionClient.name)

      if (error.message.match(/status code 500/)) {
        throw Error.UNPROCESSABLE_ENTITY
      }

      throw error
    }
  }
}
