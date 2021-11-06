import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UpdateResourceClient, GetClientToken } from '../client'
import { Resource } from '../domain'
import { FindResourceService } from './find-resource.service'

@Injectable()
export class UpdateResourceService {
  constructor(
    private readonly updateResourceClient: UpdateResourceClient,
    private readonly getClientToken: GetClientToken,
    private readonly findResourceService: FindResourceService,
    private readonly configService: ConfigService,
  ) {}

  async perform(realm: string, name: string, resource: Resource): Promise<void> {
    try {
      const { data } = await this.getClientToken.getClient(
        realm,
        this.configService.get('KEYCLOAK_FOLDER_CLIENT_ID'),
      )
      const accessToken = data['access_token']
      const resourceId = await this.findResourceService.perform(realm, accessToken, name)

      resource.id = resourceId

      await this.updateResourceClient.update(realm, accessToken, resource)
    } catch (error) {
      Logger.error('Error on trying to update resource', error, UpdateResourceService.name)

      throw error
    }
  }
}
