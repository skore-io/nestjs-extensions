import { Injectable } from '@nestjs/common'
import { KeycloakClient } from '../client'

@Injectable()
export class ValidateAccessToken {
  constructor(private readonly keycloackClient: KeycloakClient) {}

  async perform(realm: string, token: string): Promise<boolean> {
    const isValidAccessToken = await this.keycloackClient.isValidAccessToken(realm, token)

    return !!isValidAccessToken
  }
}
