import { Injectable, Logger } from '@nestjs/common'
import { stringify } from 'querystring'
import { CheckResourcePermissionsClient } from '../client'
import { User } from '../domain'
import { KeycloakUtils } from '../utils'

@Injectable()
export class CheckResourcePermissionsService {
  constructor(private readonly resourceClient: CheckResourcePermissionsClient) {}

  async perform(user: User, resources: string[], scope: string): Promise<void> {
    try {
      if (resources.length === 0 || !scope) throw Error('Invalid params')

      let permissions = ''
      for (const resource of resources) {
        permissions += `&${stringify({ permission: `${resource}#${scope}` })}`
      }

      const { data } = await this.resourceClient.checkUserPermission(
        KeycloakUtils.realmFromToken(user.jwtToken),
        user.jwtToken,
        permissions,
      )

      if (data.result) return

      throw new Error(data.result.message)
    } catch (error) {
      Logger.error(
        'Error on trying to check user permission',
        error,
        CheckResourcePermissionsService.name,
      )
      throw new Error('Permission Denied')
    }
  }
}
