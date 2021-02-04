import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DeleteResourceClient, GetClientToken } from '../client'
import { FindResourceService } from './find-resource.service'

@Injectable()
export class DeleteResourceService {
  constructor(
    private readonly deleteResourceClient: DeleteResourceClient,
    private readonly getClientToken: GetClientToken,
    private readonly findResourceService: FindResourceService,
    private readonly configService: ConfigService,
  ) {}

  async perform(realm: string, name: string): Promise<void> {
    try {
      const {
        data: { access_token: accessToken },
      } = await this.getClientToken.getClient(
        realm,
        this.configService.get('KEYCLOAK_FOLDER_CLIENT_ID'),
      )

      const resourceId = await this.findResourceService.perform(realm, accessToken, name)

      if (!resourceId) throw Error('Resource not found')

      await this.deleteResourceClient.perform(realm, accessToken, resourceId)
    } catch (error) {
      Logger.error('Error on trying to delete client resource', error, DeleteResourceService.name)

      throw error
    }
  }
}
