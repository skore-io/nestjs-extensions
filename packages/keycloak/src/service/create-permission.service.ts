import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CreatePermissionClient, GetClientToken } from '../client'
import { Permission } from '../domain'

type CreatePermission = Omit<Permission, 'id' | 'name' | ''>

@Injectable()
export class CreatePermissionService {
  constructor(
    private readonly createPermissionClient: CreatePermissionClient,
    private readonly getClientToken: GetClientToken,
    private readonly configService: ConfigService,
  ) {}

  async perform(realm: string, createPermission: CreatePermission): Promise<Permission> {
    const { group, user, resourceId, scopes } = createPermission
    const name = `${resourceId}_${user || group}`
    const permission = new Permission(name, resourceId, scopes, user, group)

    try {
      if (!permission.user && !permission.group) throw Error('User or group is required')
      if (!permission.resourceId) throw Error('Resource is required')

      Logger.log(`Creating permission ${permission.name} in keycloak`, CreatePermissionService.name)

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
