import { Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { Permission } from '../domain'
import { KeycloakClient } from './keycloak.client'

@Injectable()
export class UpdatePermissionClient extends KeycloakClient {
  update(realm: string, clientToken: string, permission: Permission): Promise<AxiosResponse> {
    const params = {
      name: permission.name,
      groups: permission.groups,
      users: permission.users,
    }

    return super.put(`/auth/realms/${realm}/authz/protection/uma-policy/${permission.id}`, params, {
      headers: {
        Authorization: `Bearer ${clientToken}`,
      },
    })
  }
}
