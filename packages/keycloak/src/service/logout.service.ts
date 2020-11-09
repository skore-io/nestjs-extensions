import { Injectable } from '@nestjs/common'
import { LogoutClient } from '../client'

@Injectable()
export class LogoutService {
  constructor(private readonly loginClient: LogoutClient) {}

  async perform(
    realm: string,
    clientId: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    await this.loginClient.invalidateToken(realm, clientId, accessToken, refreshToken)
  }
}
