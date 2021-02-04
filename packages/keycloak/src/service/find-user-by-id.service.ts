import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FindUserClient, GetClientToken } from '../client'
import { User } from '../domain'

@Injectable()
export class FindUserByIdService {
  constructor(
    private readonly findUserClient: FindUserClient,
    private readonly getClientToken: GetClientToken,
    private readonly configService: ConfigService,
  ) {}

  async perform(realm: string, id: string): Promise<User> {
    const {
      data: { access_token: clientToken },
    } = await this.getClientToken.getClient(
      realm,
      this.configService.get('KEYCLOAK_USER_CLIENT_ID'),
    )

    return this.findUserClient.info(realm, clientToken, id)
  }
}
