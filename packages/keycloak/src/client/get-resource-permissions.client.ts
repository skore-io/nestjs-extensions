import { Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { stringify } from 'qs'
import { KeycloakClient } from './keycloak.client'

@Injectable()
export class GetResourcePermissionsClient extends KeycloakClient {
  getResources(realm: string, accessToken: string, permission: string): Promise<AxiosResponse> {
    return super.post(
      `/auth/realms/${realm}/protocol/openid-connect/token`,
      stringify({
        grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
        audience: this.configService.get('KEYCLOAK_FOLDER_CLIENT_ID'),
        response_mode: 'permissions',
      }).concat(permission),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  }
}
