import { Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { KeycloakClient } from './keycloak.client'

@Injectable()
export class DeleteResourceClient extends KeycloakClient {
  perform(realm: string, accessToken: string, resourceId: string): Promise<AxiosResponse> {
    return super.delete(`/auth/realms/${realm}/authz/protection/resource_set/${resourceId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }
}
