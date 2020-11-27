import { Injectable, HttpService } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

@Injectable()
export class KeycloakClient {
  private readonly keycloakServerUrl: string
  private readonly _clientId: string

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.keycloakServerUrl = this.configService.get('KEYCLOAK_SERVER_URL')
    this._clientId = this.configService.get('KEYCLOAK_CLIENT_ID')
  }

  get clientId(): string {
    return this._clientId
  }

  post(path: string, params: unknown, headers: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.httpService.post(`${this.keycloakServerUrl}${path}`, params, headers).toPromise()
  }
}
