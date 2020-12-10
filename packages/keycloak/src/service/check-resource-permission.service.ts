import { Injectable, Logger } from '@nestjs/common'
import { stringify } from 'querystring'
import { CheckResourcePermissionClient } from '../client'
import { User } from '../domain'
import { KeycloakUtils } from '../utils'

@Injectable()
export class CheckResourcePermissionService {
  constructor(private readonly resourceClient: CheckResourcePermissionClient) {}

  async perform(user: User, resources: string[], scope: string): Promise<void> {
    try {
      if (resources.length === 0 || !scope) throw Error('Invalid params')

      let permissions = ''
      for (const resource of resources) {
        permissions += `&${stringify({ permission: `${resource}#${scope}` })}`
      }

      const { data } = await this.resourceClient.checkUserPermission(
        KeycloakUtils.realmFromToken(user.accessToken),
        user.accessToken,
        permissions,
      )

      if (data.result) return

      throw Error(data.result.message)
    } catch (error) {
      const errorDescription = error.response?.data?.error_description || error

      Logger.error(
        'Error on trying to check user permission',
        errorDescription,
        CheckResourcePermissionService.name,
      )

      throw Error('Permission Denied')
    }
  }
}
