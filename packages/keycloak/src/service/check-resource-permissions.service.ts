import { Injectable, Logger } from '@nestjs/common'
import { stringify } from 'querystring'
import { CheckResourcePermissionsClient } from '../client'

@Injectable()
export class CheckResourcePermissionsService {
  constructor(private readonly resourceClient: CheckResourcePermissionsClient) {}

  async perform(
    realm: string,
    accessToken: string,
    resources: string[],
    scope: string,
  ): Promise<void> {
    try {
      if (resources.length === 0 || !scope) throw Error('Invalid params')

      let permissions = ''
      for (const resource of resources) {
        permissions += `&${stringify({ permission: `${resource}#${scope}` })}`
      }

      const { data } = await this.resourceClient.checkUserPermission(
        realm,
        accessToken,
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
