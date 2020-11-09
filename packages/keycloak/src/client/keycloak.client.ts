import { stringify } from 'qs'
import { Injectable, HttpService, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class KeycloakClient {
  private readonly authorizationServerUrl: string

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.authorizationServerUrl = `${this.configService.get('KEYCLOAK_SERVER_URL')}/auth`
  }

  async getAccessToken(realm: string, username: string, password: string): Promise<string> {
    try {
      const { data } = await this.httpService
        .post(
          `${process.env.KEYCLOAK_SERVER_URL}/auth/realms/${realm}/protocol/openid-connect/token`,
          stringify({
            client_id: this.configService.get('KEYCLOAK_CLIENT_ID'),
            scope: 'email profile',
            username,
            password,
            grant_type: 'password',
          }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        )
        .toPromise()

      return data?.access_token
    } catch (error) {
      Logger.error(`Error on getting access token ${error}`, KeycloakClient.name)

      throw error
    }
  }
}
