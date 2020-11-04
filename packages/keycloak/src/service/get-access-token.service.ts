import { Injectable } from '@nestjs/common'
import { KeycloakClient } from '../client'

@Injectable()
export class GetAccessTokenService {
  constructor(private readonly keycloakClient: KeycloakClient) {}

  async perform(realm: string, username: string, password: string): Promise<string> {
    const accessToken = await this.keycloakClient.getAccessToken(realm, username, password)

    return accessToken
  }
}
