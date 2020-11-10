import { stringify } from 'qs'
import { Injectable, HttpService } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class LogoutClient {
  private readonly keycloakServerUrl: string

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.keycloakServerUrl = this.configService.get('KEYCLOAK_SERVER_URL')
  }

  async invalidateToken(
    realm: string,
    clientId: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<unknown> {
    return this.httpService
      .post(
        `${this.keycloakServerUrl}/auth/realms/${realm}/protocol/openid-connect/logout`,
        stringify({
          client_id: clientId,
          refresh_token: refreshToken,
        }),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .toPromise()
  }
}
