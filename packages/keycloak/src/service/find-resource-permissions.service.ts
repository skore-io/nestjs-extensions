import { Injectable, Logger } from '@nestjs/common'
import { FindResourcePermissionsClient, GetClientToken } from '../client'
import { FindResourceService } from './find-resource.service'
import { Permission } from '../domain'
import { KeycloakUtils } from '../utils'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class FindResourcePermissionsService {
  constructor(
    private readonly findResourcePermissionsClient: FindResourcePermissionsClient,
    private readonly getClientToken: GetClientToken,
    private readonly configService: ConfigService,
    private readonly findResourceService: FindResourceService,
  ) {}

  async perform(token: string, resourceName: string): Promise<Permission[]> {
    try {
      const realm = KeycloakUtils.realmFromToken(token)
      const { data: client } = await this.getClientToken.getClient(
        realm,
        this.configService.get('KEYCLOAK_FOLDER_CLIENT_ID'),
      )
      const resourceId = await this.findResourceService.perform(realm, client['access_token'], resourceName)

      Logger.log(
        `Finding permissions for resource ${resourceId}`,
        FindResourcePermissionsService.name,
      )

      const { data } = await this.findResourcePermissionsClient.findPermissions(
        realm,
        client['access_token'],
        resourceId,
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const permissions: any = data

      return permissions.map(permission => {
        return {
          ...new Permission(
            permission.name,
            resourceId,
            permission.scopes[0],
            permission.users,
            permission.groups,
          ),
          id: permission.id,
        }
      })
    } catch (error) {
      const errorDescription = error.response?.data?.error_description || error

      Logger.error(
        'Error on trying to get permissions',
        errorDescription,
        FindResourcePermissionsService.name,
      )

      throw errorDescription
    }
  }
}
