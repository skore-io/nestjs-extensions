import { Injectable, Logger } from '@nestjs/common'
import { KeycloakUtils } from '../utils'
import { stringify } from 'qs'
import { GetResourcePermissionsClient } from '../client'
import { ScopeType, User } from '../domain'

@Injectable()
export class GetResourcePermissionsService {
  constructor(private readonly getResourcePermissions: GetResourcePermissionsClient) {}

  async perform(user: User, resources: string[], scope: ScopeType): Promise<string[]> {
    if (resources.length === 0 || !scope) throw Error('Invalid params')

    try {
      let permissions = ''
      for (const resource of resources) {
        permissions += `&${stringify({ permission: `${resource}#${scope}` })}`
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data }: any = await this.getResourcePermissions.getResources(
        KeycloakUtils.realmFromToken(user.accessToken),
        user.accessToken,
        permissions,
      )
      return data.map((resource) => resource.rsname)
    } catch (error) {
      const errorDescription = error.response?.data?.error_description || error

      Logger.error(
        'Error on trying to get permissions',
        errorDescription,
        GetResourcePermissionsService.name,
      )

      throw new Error('Permission Denied')
    }
  }
}
