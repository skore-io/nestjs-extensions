import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CreateResourceClient, GetClientToken } from '../client'
import { Resource } from '../domain'

@Injectable()
export class CreateResourceService {
  constructor(
    private readonly createResourceClient: CreateResourceClient,
    private readonly getClientToken: GetClientToken,
    private readonly configService: ConfigService,
  ) {}

  async perform(realm: string, resource: Resource): Promise<Resource> {
    Logger.log(`Creating resource ${resource.name} in keycloak`, CreateResourceClient.name)

    try {
      if (!resource.name || !resource.displayName) throw Error('Name or displayName is missing')

      resource.scopes = Resource.DEFAULT_SCOPES

      const {
        data: { access_token: accessToken },
      } = await this.getClientToken.getClient(
        realm,
        this.configService.get('KEYCLOAK_FOLDER_CLIENT_ID'),
      )

      const { data } = await this.createResourceClient.create(realm, accessToken, resource)

      resource.id = data._id

      return resource
    } catch (error) {
      Logger.error('Error on trying to create resource', error, CreateResourceService.name)

      throw error
    }
  }
}
