import { stringify } from 'qs'
import { Injectable, HttpService } from '@nestjs/common'
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
  ): Promise<object> {
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

    return data
  }
}
