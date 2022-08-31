import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { Compute, GoogleAuth, JWT } from 'google-auth-library'
import { MemoryCache } from 'ts-method-cache'
import { lastValueFrom } from 'rxjs'
import { RequestMethodEnum } from '../enum'

@Injectable()
export class AuthedRequest {
  private static readonly THIRTY_MINUTES_IN_SECONDS = 30 * 60

  constructor(private readonly httpService: HttpService) {}

  async rest(url: string, method: RequestMethodEnum): Promise<AxiosResponse> {
    const token = await this.fetchToken(url)

    const request = this.httpService.request({
      url,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    return lastValueFrom(request)
  }

  async graphql(url: string, query: string, variables?: unknown): Promise<AxiosResponse> {
    const token = await this.fetchToken(url)

    const data = { query }
    if (variables) Object.assign(data, { variables })

    const request = this.httpService.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    return lastValueFrom(request)
  }

  @MemoryCache({ ttl: AuthedRequest.THIRTY_MINUTES_IN_SECONDS })
  async fetchToken(url: string): Promise<string> {
    const client = (await new GoogleAuth().getClient()) as JWT | Compute

    const { protocol, host } = new URL(url)

    return client.fetchIdToken(`${protocol}//${host}`)
  }
}
