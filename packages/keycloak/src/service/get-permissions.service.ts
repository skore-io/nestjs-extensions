import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GetResourcePermissionsClient } from '../../src/client'
import { stringify } from 'qs'

@Injectable()
export class GetPermissionsService {
  constructor(
    private readonly getResourcePermissions: GetResourcePermissionsClient,
    private readonly configService: ConfigService,
  ) {}

  async perform(
    realm: string,
    accessToken: string,
    resources: string[],
    scope: string,
  ): Promise<string[]> {
    try {
      if (resources.length === 0 || !scope) throw Error('Invalid params')

      let permissions = ''
      for (const resource of resources) {
        permissions += `&${stringify({ permission: `${resource}#${scope}` })}`
      }

      const { data } = await this.getResourcePermissions.getResources(
        realm,
        accessToken,
        permissions,
      )

      return data.map(resource => resource.rsname)
    } catch (error) {
      Logger.error('Error on trying to get permissions', error, GetPermissionsService.name)

      throw error
    }
  }
}
