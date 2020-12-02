import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GetResourcePermissionsClient } from '../../src/client'

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

      let permission = ''
      for (const resource of resources) permission += `&permission=${resource}%23${scope}`

      const { data } = await this.getResourcePermissions.getResources(
        realm,
        accessToken,
        permission,
      )

      return data.map(resource => resource.rsname)
    } catch (error) {
      Logger.error('Error on trying to get permissions', error, GetPermissionsService.name)

      return []
    }
  }
}
