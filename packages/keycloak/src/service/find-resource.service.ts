import { Injectable, Logger } from '@nestjs/common'
import { FindResourceClient } from '../client'

@Injectable()
export class FindResourceService {
  constructor(private readonly findResourceClient: FindResourceClient) {}

  async perform(realm: string, accessToken: string, name: string): Promise<string> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data }: any = await this.findResourceClient.find(realm, accessToken, name)
      const [resourceId] = data

      if (!resourceId) throw Error('Resource not found')

      return resourceId
    } catch (error) {
      Logger.error('Error on trying to find resource', error, FindResourceService.name)

      throw error
    }
  }
}
