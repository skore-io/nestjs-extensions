import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CreatePermissionClient, GetClientToken } from '../client'
import { FindResourceService } from './find-resource.service'
import { Permission } from '../domain'
import { KeycloakUtils } from '../utils'

type CreatePermission = Omit<Permission, 'id' | 'name' | 'resourceId'>

@Injectable()
export class CreatePermissionService {
  constructor(
    private readonly createPermissionClient: CreatePermissionClient,
    private readonly getClientToken: GetClientToken,
    private readonly findResourceService: FindResourceService,
    private readonly configService: ConfigService,
  ) {}

  async perform(
    token: string,
    resourceName: string,
    createPermission: CreatePermission,
  ): Promise<Permission> {
    const { groups, users, scope } = createPermission

    try {
      if (!resourceName) throw Error('Resource is required')

      const realm = KeycloakUtils.realmFromToken(token)
      const {
        data: { access_token: accessToken },
      } = await this.getClientToken.getClient(
        realm,
        this.configService.get('KEYCLOAK_FOLDER_CLIENT_ID'),
      )

      const resourceId = await this.findResourceService.perform(realm, accessToken, resourceName)
      const name = `${resourceId}_${scope}`
      const permission = new Permission(name, resourceId, scope, users, groups)

      await Permission.validate(permission, 'create')

      Logger.log(`Creating permission ${permission.name} in keycloak`, CreatePermissionService.name)

      const { data } = await this.createPermissionClient.create(realm, accessToken, permission)

      permission.id = data.id

      return permission
    } catch (error) {
      Logger.error('Error on trying to create permission', error, CreatePermissionService.name)

      throw error
    }
  }
}
