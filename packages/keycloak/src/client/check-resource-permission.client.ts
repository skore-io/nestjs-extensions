import { Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { stringify } from 'qs'
import { KeycloakClient } from './keycloak.client'

@Injectable()
export class CheckResourcePermissionClient extends KeycloakClient {
  checkUserPermission(
    realm: string,
    accessToken: string,
    permission: string,
  ): Promise<AxiosResponse> {
    return super.post(
      `/auth/realms/${realm}/protocol/openid-connect/token`,
      stringify({
        grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
        response_mode: 'decision',
        audience: this.configService.get('KEYCLOAK_FOLDER_CLIENT_ID'),
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
