import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { RequestMethodEnum } from '../enum'
import { lastValueFrom } from 'rxjs'
import { KeycloakClient } from '../client'
import { AxiosResponse } from 'axios'
import { MemoryCache } from 'ts-method-cache'

@Injectable()
export class AuthedRequest {
  private static readonly THIRTY_SECONDS = 30

  constructor(
    private readonly keycloakClient: KeycloakClient,
    private readonly httpService: HttpService,
  ) {}

  async rest(url: string, method: RequestMethodEnum, data?: object): Promise<AxiosResponse> {
    const token = await this.fetchToken()

    const request = this.httpService.request({
      url,
      method: method.toLowerCase(),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      ...(data && { data }),
    })

    return lastValueFrom(request)
  }

  async graphql(url: string, query: string, variables: unknown = {}): Promise<AxiosResponse> {
    const token = await this.fetchToken()

    const request = this.httpService.post(
      url,
      { query, variables },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )

    return lastValueFrom(request)
  }

  @MemoryCache({ ttl: AuthedRequest.THIRTY_SECONDS })
  async fetchToken(): Promise<string> {
    const { access_token: accessToken } = await this.keycloakClient.getToken()

    return accessToken
  }
}
