import { Injectable, Logger } from '@nestjs/common'
import { LoginClient } from '../client'

@Injectable()
export class LoginService {
  constructor(private readonly loginClient: LoginClient) {}

  async perform(
    realm: string,
    clientId: string,
    username: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const result = await this.loginClient.generateToken(realm, clientId, username, password)

      return {
        accessToken: result['access_token'],
        refreshToken: result['refresh_token'],
      }
    } catch (error) {
      Logger.error('Error on doing login', error, LoginService.name)

      throw error
    }
  }
}
