import { Injectable, HttpService } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

@Injectable()
export class KeycloakClient {
  private readonly keycloakServerUrl: string
  private readonly _clientId: string
  private readonly _clientSecret: string

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.keycloakServerUrl = this.configService.get('KEYCLOAK_SERVER_URL')
    this._clientId = this.configService.get('KEYCLOAK_CLIENT_ID')
    this._clientSecret = this.configService.get('KEYCLOAK_CLIENT_SECRET')
  }

  get clientId(): string {
    return this._clientId
  }

  get clientSecret(): string {
    return this._clientSecret
  }

  post(path: string, params: unknown, headers: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.httpService.post(`${this.keycloakServerUrl}${path}`, params, headers).toPromise()
  }

  put(path: string, params: unknown, headers: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.httpService.put(`${this.keycloakServerUrl}${path}`, params, headers).toPromise()
  }

  delete(path: string, headers: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.httpService.delete(`${this.keycloakServerUrl}${path}`, headers).toPromise()
  }

  get(path: string, headers: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.httpService.get(`${this.keycloakServerUrl}${path}`, headers).toPromise()
  }
}
