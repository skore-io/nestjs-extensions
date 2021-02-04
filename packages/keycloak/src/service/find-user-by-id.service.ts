import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FindUserClient, GetClientToken } from '../client'
import { User } from '../domain'
import { KeycloakUtils } from '../utils'

@Injectable()
export class FindUserByIdService {
  constructor(
    private readonly findUserClient: FindUserClient,
    private readonly getClientToken: GetClientToken,
    private readonly configService: ConfigService,
  ) {}

  async perform(token: string, id: string): Promise<User> {
    Logger.log(`Searching user ${id} in keycloak`, FindUserByIdService.name)

    const realm = KeycloakUtils.realmFromToken(token)

    const {
      data: { access_token: clientToken },
    } = await this.getClientToken.getClient(
      realm,
      this.configService.get('KEYCLOAK_USER_CLIENT_ID'),
    )

    return this.findUserClient.info(realm, clientToken, id)
  }
}
