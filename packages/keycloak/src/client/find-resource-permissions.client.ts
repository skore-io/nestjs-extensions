import { Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { KeycloakClient } from './keycloak.client'

@Injectable()
export class FindResourcePermissionsClient extends KeycloakClient {
  findPermissions(realm: string, clientToken: string, resourceId: string): Promise<AxiosResponse> {
    return super.get(`/auth/realms/${realm}/authz/protection/uma-policy?resource=${resourceId}`, {
      headers: {
        Authorization: `Bearer ${clientToken}`,
      },
    })
  }
}
