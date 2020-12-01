import { Injectable, Logger } from '@nestjs/common'
import { DeleteResourceClient, GetClientToken } from '../client'
import { FindResourceService } from './find-resource.service'

@Injectable()
export class DeleteResourceService {
  constructor(
    private readonly deleteResourceClient: DeleteResourceClient,
    private readonly getClientToken: GetClientToken,
    private readonly findResourceService: FindResourceService,
  ) {}

  async perform(realm: string, name: string): Promise<void> {
    try {
      const {
        data: { access_token: accessToken },
      } = await this.getClientToken.get(realm)

      const resourceId = await this.findResourceService.perform(realm, accessToken, name)

      if (!resourceId) throw Error('Resource not found')

      await this.deleteResourceClient.perform(realm, accessToken, resourceId)
    } catch (error) {
      Logger.error('Error on trying to delete client resource', error, DeleteResourceService.name)

      throw error
    }
  }
}
