import { Injectable } from '@nestjs/common'
import { LoginClient } from '../client'

@Injectable()
export class LoginService {
  constructor(private readonly loginClient: LoginClient) {}

  perform(
    realm: string,
    clientId: string,
    username: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.loginClient.generateToken(realm, clientId, username, password)
  }
}
