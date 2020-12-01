import { Injectable, Logger } from '@nestjs/common'
import { DeleteResourceClient, GetClientToken } from '../client'

@Injectable()
export class DeleteResourceService {
  constructor(
    private readonly deleteResourceClient: DeleteResourceClient,
    private readonly getClientToken: GetClientToken,
  ) {}

  async perform(realm: string, resourceId: string): Promise<void> {
    try {
      const {
        data: { access_token: accessToken },
      } = await this.getClientToken.get(realm)

      await this.deleteResourceClient.perform(realm, accessToken, resourceId)
    } catch (error) {
      Logger.error('Error on trying to delete client resource', error, DeleteResourceService.name)

      throw error
    }
  }
}
