import { Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { KeycloakClient } from './keycloak.client'

@Injectable()
export class FindResourceClient extends KeycloakClient {
  find(realm: string, accessToken: string, name: string): Promise<AxiosResponse> {
    return super.get(`/auth/realms/${realm}/authz/protection/resource_set?name=${name}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }
}
