import { Injectable } from '@nestjs/common'
import { KeycloakClient } from '../client'

const INVALID_ACCESS_TOKEN = 'Invalid access token'

@Injectable()
export class ValidateAccessTokenService {
  constructor(private readonly keycloakClient: KeycloakClient) {}

  async perform(realm: string, token: string): Promise<void> {
    const isValidAccessToken = await this.keycloakClient.isValidAccessToken(realm, token)
    if (isValidAccessToken) return null

    throw new Error(INVALID_ACCESS_TOKEN)
  }
}
