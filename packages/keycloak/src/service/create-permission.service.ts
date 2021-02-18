import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CreatePermissionClient, GetClientToken } from '../client'
import { Permission } from '../domain'
import { KeycloakUtils } from '../utils'

type CreatePermission = Omit<Permission, 'id' | 'name'>

@Injectable()
export class CreatePermissionService {
  constructor(
    private readonly createPermissionClient: CreatePermissionClient,
    private readonly getClientToken: GetClientToken,
    private readonly configService: ConfigService,
  ) {}

  async perform(token: string, createPermission: CreatePermission): Promise<Permission> {
    const { groups, users, resourceId, scope } = createPermission
    const name = `${resourceId}_${scope}`
    const permission = new Permission(name, resourceId, scope, users, groups)

    try {
      await Permission.validate(permission)

      Logger.log(`Creating permission ${permission.name} in keycloak`, CreatePermissionService.name)

      const realm = KeycloakUtils.realmFromToken(token)

      const {
        data: { access_token: accessToken },
      } = await this.getClientToken.getClient(
        realm,
        this.configService.get('KEYCLOAK_FOLDER_CLIENT_ID'),
      )

      const { data } = await this.createPermissionClient.create(realm, accessToken, permission)

      permission.id = data.id

      return permission
    } catch (error) {
      Logger.error('Error on trying to create permission', error, CreatePermissionService.name)

      throw error
    }
  }
}
