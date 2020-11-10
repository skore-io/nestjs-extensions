import { Injectable, Logger } from '@nestjs/common'
import { LogoutClient } from '../client'

@Injectable()
export class LogoutService {
  constructor(private readonly logoutClient: LogoutClient) {}

  async perform(
    realm: string,
    clientId: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    try {
      await this.logoutClient.invalidateToken(realm, clientId, accessToken, refreshToken)
    } catch (error) {
      Logger.error('Error on doing logout', error, LogoutService.name)

      throw error
    }
  }
}
