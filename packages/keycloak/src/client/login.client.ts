import { stringify } from 'qs'
import { Injectable, HttpService, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class LoginClient {
  private readonly keycloakServerUrl: string

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.keycloakServerUrl = this.configService.get('KEYCLOAK_SERVER_URL')
  }

  async generateToken(
    realm: string,
    clientId: string,
    username: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { data } = await this.httpService
        .post(
          `${this.keycloakServerUrl}/auth/realms/${realm}/protocol/openid-connect/token`,
          stringify({
            client_id: clientId,
            scope: 'email profile',
            grant_type: 'password',
            username,
            password,
          }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        )
        .toPromise()

      return {
        accessToken: data?.access_token,
        refreshToken: data?.refresh_token,
      }
    } catch (error) {
      Logger.error('Error on doing login', error, LoginClient.name)

      throw error
    }
  }
}
