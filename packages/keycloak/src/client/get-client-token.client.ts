import { Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { stringify } from 'qs'
import { KeycloakClient } from './keycloak.client'

@Injectable()
export class GetClientToken extends KeycloakClient {
  get(realm: string): Promise<AxiosResponse> {
    return super.post(
      `/auth/realms/${realm}/protocol/openid-connect/token`,
      stringify({
        client_id: super.clientId,
        client_secret: super.clientSecret,
        grant_type: 'client_credentials',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    )
  }
}
