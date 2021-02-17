import { Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { Permission } from '../domain'
import { KeycloakClient } from './keycloak.client'

@Injectable()
export class CreatePermissionClient extends KeycloakClient {
  create(realm: string, clientToken: string, permission: Permission): Promise<AxiosResponse> {
    const params = {
      name: permission.name,
      scopes: permission.scopes,
      groups: [],
      users: [],
    }

    if (permission.group) params.groups = [permission.group]
    if (permission.user) params.users = [permission.user]

    return super.post(
      `/auth/realms/${realm}/authz/protection/uma-policy/${permission.resourceId}`,
      params,
      {
        headers: {
          Authorization: `Bearer ${clientToken}`,
        },
      },
    )
  }
}
