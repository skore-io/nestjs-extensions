import { Injectable, Logger } from '@nestjs/common'
import { UpdateResourceClient, GetClientToken } from '../client'
import { Resource } from '../domain'

@Injectable()
export class UpdateResourceService {
  constructor(
    private readonly updateResourceClient: UpdateResourceClient,
    private readonly getClientToken: GetClientToken,
  ) {}

  async perform(realm: string, resource: Resource): Promise<Resource> {
    try {
      const {
        data: { access_token: accessToken },
      } = await this.getClientToken.get(realm)

      const { data } = await this.updateResourceClient.update(realm, accessToken, resource)

      resource.id = data._id

      return resource
    } catch (error) {
      Logger.error('Error on trying to update resource', error, UpdateResourceService.name)

      throw error
    }
  }
}
