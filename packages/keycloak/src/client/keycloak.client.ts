import Keycloak from 'keycloak-connect'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class KeycloakClient {
  private readonly clientsCache = new Map<string, Keycloak.Keycloak>()
  private readonly authorizationServerUrl: string

  constructor(private readonly configService: ConfigService) {
    this.authorizationServerUrl = `${this.configService.get('KEYCLOAK_SERVER_URL')}/auth`
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
          realm,
          resource: this.configService.get('KEYCLOAK_CLIENT_ID'),
          secret: this.configService.get('KEYCLOAK_CLIENT_SECRET'),
          authServerUrl: this.authorizationServerUrl,
        } as any),
      )
    }

    return this.clientsCache.get(realm)
  }
}
