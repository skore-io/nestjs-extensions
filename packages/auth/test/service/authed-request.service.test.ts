/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HttpService } from '@nestjs/axios'
import { suite, test } from '@testdeck/jest'
import { KeycloakClient } from '../../src/client'
import { RequestMethodEnum } from '../../src/enum'
import { GetTokenType } from '../../src/type'
import { AuthedRequest } from '../../src/service'
import { of } from 'rxjs'

@suite
export class AuthedRequestServiceTest {
  private keycloakClient: Partial<KeycloakClient>
  private httpService: Partial<HttpService>
  private responseClientKeycloak: GetTokenType
  private responseFake
  private paramsFake: {
    url: string
    method: RequestMethodEnum
    data: object
    query: string
    variables: unknown
  }

  before() {
    this.responseFake = {
      data: { test: 'yolo' },
    }

    this.paramsFake = {
      data: { bilu: 'test' },
      method: RequestMethodEnum.DELETE,
      query: 'query {}',
      url: 'http://localhost:3000',
      variables: [],
    }

    this.responseClientKeycloak = {
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJiODNjYzhkZi03MDEyLTQ4MDItYTk2Yi0xZmE2MTFlZWFmZTcifQ.eyJleHAiOjE2ODQ0MTg5MjUsImlhdCI6MTY4NDQxODYyNSwianRpIjoiNmE3MjFiNjAtNDNiYS00MDM0LThiMGYtYmQzODAyOWEyNGQ4IiwiaXNzIjoiaHR0cDovL2tleWNsb2FrLmxlYXJuaW5ncm9ja3MuaW5mby9hdXRoL3JlYWxtcy9sZWFybmluZ3JvY2tzIiwic3ViIjoiNzFkYWZjODktOTc2OS00YThhLThlNWItMDE0MDY4MmY1M2U3IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibGVhcm5pbmdyb2Nrcy1pbmZvIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWxlYXJuaW5ncm9ja3MiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsibGVhcm5pbmdyb2Nrcy1pbmZvIjp7InJvbGVzIjpbInVtYV9wcm90ZWN0aW9uIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiY2xpZW50SWQiOiJsZWFybmluZ3JvY2tzLWluZm8iLCJjbGllbnRIb3N0IjoiMTAuMC4xMDIuMjIxIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtbGVhcm5pbmdyb2Nrcy1pbmZvIiwiY2xpZW50QWRkcmVzcyI6IjEwLjAuMTAyLjIyMSJ9.kxdXAZxMm5k-I0tagBQiEYsfj3AAJaoF-BrJQHp8fvQ',
      expires_in: 300,
      refresh_expires_in: 0,
      token_type: 'Bearer',
      'not-before-policy': 0,
      scope: 'profile email',
    }

    this.keycloakClient = {
      getToken: jest.fn().mockReturnValueOnce(this.responseClientKeycloak),
    }

    this.httpService = {
      request: jest.fn().mockImplementationOnce(() => of(this.responseFake)),
      post: jest.fn().mockImplementationOnce(() => of(this.responseFake)),
    }
  }

  @test
  async '[rest] Should call request method with acess token'() {
    const service = new AuthedRequest(
      // @ts-ignore
      this.keycloakClient,
      this.httpService,
    )

    const { data, method, url } = this.paramsFake

    const response = await service.rest(url, method, data)

    expect(this.httpService.request).toHaveBeenCalledWith({
      url,
      method: method.toLowerCase(),
      headers: {
        Authorization: `Bearer ${this.responseClientKeycloak.access_token}`,
        'Content-Type': 'application/json',
      },
      data,
    })

    expect(response).toEqual(this.responseFake)
  }

  @test
  async '[graphql] Should call post method with acess token'() {
    const service = new AuthedRequest(
      // @ts-ignore
      this.keycloakClient,
      this.httpService,
    )

    const { url, query, variables } = this.paramsFake

    const response = await service.graphql(url, query, variables)

    expect(this.httpService.post).toHaveBeenCalledWith(
      url,
      { query, variables },
      {
        headers: {
          Authorization: `Bearer ${this.responseClientKeycloak.access_token}`,
          'Content-Type': 'application/json',
        },
      },
    )

    expect(response).toEqual(this.responseFake)
  }
}
