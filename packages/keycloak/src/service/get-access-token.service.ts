import { Injectable } from '@nestjs/common'
import { KeycloakClient } from '../client'

@Injectable()
export class GetAccessTokenService {
  constructor(private readonly keycloakClient: KeycloakClient) {}

  perform(realm: string, username: string, password: string): Promise<string> {
    return this.keycloakClient.getAccessToken(realm, username, password)
  }
}
