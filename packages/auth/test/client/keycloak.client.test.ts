/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { suite, test } from '@testdeck/jest'
import { KeycloakClient } from '../../src/client'
import { of } from 'rxjs'
import { GetTokenType, ValidateTokenType } from '../../src/type'
import { BadRequestException, UnauthorizedException } from '@nestjs/common'
import qs from 'qs'

@suite('[Auth] Keycloak Client')
export class KeyCloakClientTest {
  private authBaseUrlFake: string
  private configService: Partial<ConfigService>
  private responseHttpService: GetTokenType | ValidateTokenType
  private httpService: Partial<HttpService>
  private keycloakCredential: string
  private readonly clientIdFake: string = 'client'
  private readonly clientSecretFake: string = 'secret'

  before() {
    this.authBaseUrlFake = 'https://localhost:8080'
    this.keycloakCredential = Buffer.from(`${this.clientIdFake}:${this.clientSecretFake}`).toString(
      'base64',
    )

    this.configService = {
      get: jest
        .fn()
        .mockReturnValueOnce(this.authBaseUrlFake)
        .mockReturnValueOnce(this.keycloakCredential),
    }

    this.httpService = {
      post: jest
        .fn()
        .mockImplementationOnce(() => {
          this.responseHttpService = {
            access_token: 'string',
            expires_in: 300,
            refresh_expires_in: 300,
            token_type: 'Bearer',
            'not-before-policy': 300,
            scope: 'string',
          }

          return of({
            data: this.responseHttpService,
          })
        })
        .mockImplementationOnce(() => {
          this.responseHttpService = {
            active: true,
          }
          return of({
            data: this.responseHttpService,
          })
        }),
    }
  }

  @test
  async '[getToken] Should get token successfully'() {
    const client = new KeycloakClient(
      // @ts-ignore
      this.configService,
      this.httpService,
    )

    const response = await client.getToken()

    expect(this.httpService.post).toBeCalledWith(
      `${this.authBaseUrlFake}/auth/realms/learningrocks/protocol/openid-connect/token`,
      qs.stringify({ grant_type: 'client_credentials' }),
      {
        headers: {
          Authorization: `Basic ${this.keycloakCredential}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    expect(response).toEqual(this.responseHttpService)
  }

  @test
  async '[getToken] Should throw error'() {
    const error = new BadRequestException({
      error: 'invalid_client',
      error_description: 'Invalid client credentials',
    })

    this.httpService.post = jest.fn().mockImplementation(() => {
      throw error
    })

    const client = new KeycloakClient(
      // @ts-ignore
      this.configService,
      this.httpService,
    )

    try {
      await client.getToken()
    } catch (err) {
      expect(err).toEqual(error)
    }
  }

  @test
  async '[validateToken] Should get token successfully'() {
    const client = new KeycloakClient(
      // @ts-ignore
      this.configService,
      this.httpService,
    )

    const fakeToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJoemFyQ29lZjFKVHZPajZKbkhSUjM3UEFDTzNhdHlzb092TTNrU05SSl8wIn0.eyJleHAiOjE2ODQyNjA2NzAsImlhdCI6MTY4NDI2MDM3MCwianRpIjoiZDg5NTcwMTctNTQ1NC00MTUxLWI2NWUtNTAzODE5NTMzZTNmIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrLmxlYXJuaW5ncm9ja3MuaW5mby9hdXRoL3JlYWxtcy9sZWFybmluZ3JvY2tzIiwic3ViIjoiOTU5ZjNiOGItOGJlMi00NTVmLTliMjItNWYzYTEyZjU0MzdiIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibGVhcm5pbmdyb2Nrcy1pbmZvIiwiYWNyIjoiMSIsInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImNsaWVudElkIjoibGVhcm5pbmdyb2Nrcy1pbmZvIiwiY2xpZW50SG9zdCI6IjEwLjAuMTAxLjE0MiIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LWxlYXJuaW5ncm9ja3MtaW5mbyIsImNsaWVudEFkZHJlc3MiOiIxMC4wLjEwMS4xNDIifQ.TV-YDX55on8jArB65sBQqqHbzEIhaV1Vkgv98STv0-5lNNPjN8ZDIWwXxJe_juQyRZBuW4TasGqHGzDvGTfKgCo27SYjcpBmljKmX0QohN62Q1AjwbTeABmWNHVwCjxa8a9PnYCJXytzXCNlAuG278_FmhmCQ7--xaVe7fgNZHCzI1CiTln17j0FnELIX1ffiPWWZLULyKqwm7Dksw70DxQrOzboS2nFEy0EYBCIYeqOQ-1lWJ27wKtoIn5Ci0QmBT4EnN7SxKcH8R7aXyhnfkaiW7-xVPCMMGO5EPppAGVczQjr3-NMQmUeRG5BPRbS_qu7LY-vS1Zl4WiuEbWCCw'

    const response = await client.validateToken(fakeToken)

    expect(this.httpService.post).toBeCalledWith(
      `${this.authBaseUrlFake}/auth/realms/learningrocks/protocol/openid-connect/token/introspect`,
      qs.stringify({
        token: fakeToken,
        client_id: this.clientIdFake,
        client_secret: this.clientSecretFake,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    expect(response).toEqual(this.responseHttpService)
  }

  @test
  async '[validateToken] Should throw error bad request unsupported_grant_type'() {
    const error = new UnauthorizedException({
      error: 'invalid_request',
      error_description: 'Authentication failed.',
    })

    this.httpService.post = jest.fn().mockImplementation(() => {
      throw error
    })

    const client = new KeycloakClient(
      // @ts-ignore
      this.configService,
      this.httpService,
    )

    const fakeToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJoemFyQ29lZjFKVHZPajZKbkhSUjM3UEFDTzNhdHlzb092TTNrU05SSl8wIn0.eyJleHAiOjE2ODQyNjA2NzAsImlhdCI6MTY4NDI2MDM3MCwianRpIjoiZDg5NTcwMTctNTQ1NC00MTUxLWI2NWUtNTAzODE5NTMzZTNmIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrLmxlYXJuaW5ncm9ja3MuaW5mby9hdXRoL3JlYWxtcy9sZWFybmluZ3JvY2tzIiwic3ViIjoiOTU5ZjNiOGItOGJlMi00NTVmLTliMjItNWYzYTEyZjU0MzdiIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibGVhcm5pbmdyb2Nrcy1pbmZvIiwiYWNyIjoiMSIsInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImNsaWVudElkIjoibGVhcm5pbmdyb2Nrcy1pbmZvIiwiY2xpZW50SG9zdCI6IjEwLjAuMTAxLjE0MiIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LWxlYXJuaW5ncm9ja3MtaW5mbyIsImNsaWVudEFkZHJlc3MiOiIxMC4wLjEwMS4xNDIifQ.TV-YDX55on8jArB65sBQqqHbzEIhaV1Vkgv98STv0-5lNNPjN8ZDIWwXxJe_juQyRZBuW4TasGqHGzDvGTfKgCo27SYjcpBmljKmX0QohN62Q1AjwbTeABmWNHVwCjxa8a9PnYCJXytzXCNlAuG278_FmhmCQ7--xaVe7fgNZHCzI1CiTln17j0FnELIX1ffiPWWZLULyKqwm7Dksw70DxQrOzboS2nFEy0EYBCIYeqOQ-1lWJ27wKtoIn5Ci0QmBT4EnN7SxKcH8R7aXyhnfkaiW7-xVPCMMGO5EPppAGVczQjr3-NMQmUeRG5BPRbS_qu7LY-vS1Zl4WiuEbWCCw'

    try {
      await client.validateToken(fakeToken)
    } catch (err) {
      expect(err).toEqual(error)
    }
  }
}
