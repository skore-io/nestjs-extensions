import * as Keycloak from 'keycloak-connect'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class KeycloakClient {
  private readonly clientsCache = new Map<string, Keycloak.Keycloak>()
  private readonly clientId: string
  private readonly clientSecret: string
  private readonly authorizationServerUrl: string

  constructor(configService: ConfigService) {
    this.clientId = configService.get('CLIENT_ID')
    this.clientSecret = configService.get('CLIENT_SECRET')
    this.authorizationServerUrl = configService.get('AUTHORIZATION_SERVER_URL')
  }

  async isValidAccessToken(realm: string, token: string): Promise<boolean> {
    const tokenResult = await this.clientForRealm(realm).grantManager.validateAccessToken(token)

    if (typeof tokenResult === 'string') return true
  }

  private clientForRealm(realm: string): Keycloak.Keycloak {
    if (!this.clientsCache.has(realm)) {
      /* eslint-disable @typescript-eslint/no-explicit-any */

      this.clientsCache.set(
        realm,
        new Keycloak({}, {
          resource: this.clientId,
          realm,
          authServerUrl: this.authorizationServerUrl,
          secret: this.clientSecret,
        } as any),
      )
    }

    return this.clientsCache.get(realm)
  }
}
