import { Injectable, Logger } from '@nestjs/common'
import { FindResourceClient } from '../client'

@Injectable()
export class FindResourceService {
  constructor(private readonly findResourceClient: FindResourceClient) {}

  async perform(realm: string, accessToken: string, name: string): Promise<string> {
    try {
      const {
        data: [resourceId],
      } = await this.findResourceClient.find(realm, accessToken, name)

      if (!resourceId) throw Error('Resource not found')

      return resourceId
    } catch (error) {
      Logger.error('Error on trying to find resource', error, FindResourceService.name)

      throw error
    }
  }
}
