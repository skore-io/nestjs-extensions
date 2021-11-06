import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { lastValueFrom } from 'rxjs'

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
    const request = this.httpService.post(`${this.keycloakServerUrl}${path}`, params, headers)
    return lastValueFrom(request)
  }

  put(path: string, params: unknown, headers: AxiosRequestConfig): Promise<AxiosResponse> {
    const request = this.httpService.put(`${this.keycloakServerUrl}${path}`, params, headers)
    return lastValueFrom(request)
  }

  delete(path: string, headers: AxiosRequestConfig): Promise<AxiosResponse> {
    const request = this.httpService.delete(`${this.keycloakServerUrl}${path}`, headers)
    return lastValueFrom(request)
  }

  get(path: string, headers: AxiosRequestConfig): Promise<AxiosResponse> {
    const request = this.httpService.get(`${this.keycloakServerUrl}${path}`, headers)
    return lastValueFrom(request)
  }
}
