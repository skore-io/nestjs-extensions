import { Injectable, Logger } from '@nestjs/common'
import { KeycloakUtils } from '../utils'
import { stringify } from 'qs'
import { GetResourcePermissionsClient } from '../client'
import { User } from '../domain'

@Injectable()
export class GetResourcePermissionsService {
  constructor(private readonly getResourcePermissions: GetResourcePermissionsClient) {}

  async perform(user: User, resources: string[], scope: string): Promise<string[]> {
    try {
      if (resources.length === 0 || !scope) throw Error('Invalid params')

      let permissions = ''
      for (const resource of resources) {
        permissions += `&${stringify({ permission: `${resource}#${scope}` })}`
      }

      const { data } = await this.getResourcePermissions.getResources(
        KeycloakUtils.realmFromToken(user.accessToken),
        user.accessToken,
        permissions,
      )

      return data.map(resource => resource.rsname)
    } catch (error) {
      Logger.error('Error on trying to get permissions', error, GetResourcePermissionsService.name)

      throw error
    }
  }
}
