import { Injectable, HttpService } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

@Injectable()
export class KeycloakClient {
  private readonly keycloakServerUrl: string

  constructor(private readonly httpService: HttpService, readonly configService: ConfigService) {
    this.keycloakServerUrl = this.configService.get('KEYCLOAK_SERVER_URL')
  }

  clientSecret(clientId: string): string {
    return this.configService.get(`KEYCLOAK_${clientId.toUpperCase()}_CLIENT_SECRET`)
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
