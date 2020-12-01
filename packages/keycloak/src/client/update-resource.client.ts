import { Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { Resource } from '../domain'
import { KeycloakClient } from './keycloak.client'

@Injectable()
export class UpdateResourceClient extends KeycloakClient {
  update(realm: string, accessToken: string, resource: Resource): Promise<AxiosResponse> {
    const params = {}

    for (const key in resource) {
      if (!key) params[key] = resource[key]
    }

    return super.put(`/auth/realms/${realm}/authz/protection/resource_set/${resource.id}`, params, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }
}
