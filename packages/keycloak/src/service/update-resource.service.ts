import { Injectable, Logger } from '@nestjs/common'
import { UpdateResourceClient, GetClientToken, FindResourceClient } from '../client'
import { Resource } from '../domain'

@Injectable()
export class UpdateResourceService {
  constructor(
    private readonly updateResourceClient: UpdateResourceClient,
    private readonly getClientToken: GetClientToken,
    private readonly findResourceClient: FindResourceClient,
  ) {}

  async perform(realm: string, name: string, resource: Resource): Promise<void> {
    try {
      const {
        data: { access_token: accessToken },
      } = await this.getClientToken.get(realm)

      const {
        data: [resourceId],
      } = await this.findResourceClient.find(realm, accessToken, name)

      if (!resourceId) throw Error('Resource not found')

      resource.id = resourceId

      await this.updateResourceClient.update(realm, accessToken, resource)
    } catch (error) {
      Logger.error('Error on trying to update resource', error, UpdateResourceService.name)

      throw error
    }
  }
}
