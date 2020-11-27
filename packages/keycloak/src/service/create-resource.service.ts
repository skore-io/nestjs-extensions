import { Injectable, Logger } from '@nestjs/common'
import { CreateResourceClient, GetClientToken } from '../client'
import { Resource } from '../domain'

@Injectable()
export class CreateResourceService {
  constructor(
    private readonly createResourceClient: CreateResourceClient,
    private readonly getClientToken: GetClientToken,
  ) {}

  async perform(realm: string, resource: Resource): Promise<Resource> {
    try {
      if (!resource.name || !resource.displayName) throw Error('Name or displayName is missing')

      const {
        data: { access_token: accessToken },
      } = await this.getClientToken.get(realm)

      const { data } = await this.createResourceClient.create(realm, accessToken, resource)

      resource.id = data._id

      return resource
    } catch (error) {
      console.log('========', error)
      Logger.error('Error on trying to create resource', error, CreateResourceService.name)

      throw error
    }
  }
}
