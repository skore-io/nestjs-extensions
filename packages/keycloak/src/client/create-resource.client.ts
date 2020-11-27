import { Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { Resource } from '../domain'
import { KeycloakClient } from './keycloak.client'

@Injectable()
export class CreateResourceClient extends KeycloakClient {
  create(realm: string, accessToken: string, resource: Resource): Promise<AxiosResponse> {
    return super.post(
      `/auth/admin/realms/${realm}/clients/${super.clientId}/authz/resource-server/resource`,
      {
        name: resource.name,
        displayName: resource.displayName,
        type: resource.type,
        scopes: resource.scopes,
        attributes: resource.attributes,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  }
}
