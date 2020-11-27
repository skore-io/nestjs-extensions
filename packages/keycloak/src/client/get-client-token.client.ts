import { Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { stringify } from 'qs'
import { KeycloakClient } from './keycloak.client'

@Injectable()
export class GetClientToken extends KeycloakClient {
  get(realm: string): Promise<AxiosResponse> {
    // return super.post(
    //   `/auth/realms/${realm}/protocol/openid-connect/token`,
    //   stringify({
    //     client_id: 'player',
    //     client_secret: '436db9f9-d49b-4c83-9480-8e38d21570c6',
    //     grant_type: 'client_credentials',
    //   }),
    //   { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    // )

    return super.post(
      `/auth/realms/master/protocol/openid-connect/token`,
      stringify({
        client_id: 'admin-cli',
        grant_type: 'password',
        username: 'admin',
        password: 'admin',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    )
  }
}
