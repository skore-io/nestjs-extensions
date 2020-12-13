import { Injectable, Logger } from '@nestjs/common'
import { RefreshTokenClient } from '../client'

@Injectable()
export class RefreshTokenService {
  constructor(private readonly refreshTokenClient: RefreshTokenClient) {}

  async perform(
    realm: string,
    clientId: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const result = await this.refreshTokenClient.generateToken(realm, clientId, refreshToken)

      return {
        accessToken: result['access_token'],
        refreshToken: result['refresh_token'],
      }
    } catch (error) {
      Logger.error('Error trying to refresh token', error, RefreshTokenClient.name)

      throw error
    }
  }
}
