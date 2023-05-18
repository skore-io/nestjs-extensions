import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import qs from 'qs'
import { TokenKeyCloakType, ValidateTokeType } from '../type'

@Injectable()
export class KeycloakClient {
  private readonly logger: Logger = new Logger(KeycloakClient.name)

  private readonly authBaseUrl: string
  private readonly credential: string

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.authBaseUrl = this.configService.get('AUTH_BASE_URL')
    this.credential = this.configService.get('KEYCLOAK_CREDENTIAL')
  }

  async getToken(): Promise<TokenKeyCloakType> {
    try {
      const request = this.httpService.post(
        `${this.authBaseUrl}/auth/realms/learningrocks/protocol/openid-connect/token`,
        qs.stringify({ grant_type: 'client_credentials' }),
        {
          headers: {
            Authorization: `Basic ${this.credential}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )

      const { data } = await lastValueFrom(request)

      return data
    } catch (error) {
      this.logger.error('Error on getting token', JSON.stringify(error))

      throw error
    }
  }

  async validateToken(token: string): Promise<ValidateTokeType> {
    try {
      const { clientId, clientSecret } = this.decodeTokenCredential()

      const request = this.httpService.post(
        `${this.authBaseUrl}/auth/realms/learningrocks/protocol/openid-connect/token/introspect`,
        qs.stringify({
          token,
          client_id: clientId,
          client_secret: clientSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )

      const { data } = await lastValueFrom(request)

      return data
    } catch (error) {
      this.logger.error('Error on validate token', JSON.stringify(error))

      throw error
    }
  }

  private decodeTokenCredential(): { clientId: string; clientSecret: string } {
    const decodedString = Buffer.from(String(this.credential), 'base64').toString('utf-8')

    const [clientId, clientSecret] = decodedString.split(':')

    return {
      clientId,
      clientSecret,
    }
  }
}
