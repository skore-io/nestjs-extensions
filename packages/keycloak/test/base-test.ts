import { INestApplication, Type } from '@nestjs/common'
import { Test, TestingModuleBuilder } from '@nestjs/testing'
import axios from 'axios'
import { stringify } from 'qs'
import request, { SuperTest } from 'supertest'
import { KeycloakModule } from '../src'

export abstract class BaseTest {
  static app: INestApplication
  static userToken: string
  static clientToken: string
  static noAccessToken: string

  static async before() {
    jest.setTimeout(30000)

    const moduleRef = await Test.createTestingModule({
      imports: [KeycloakModule],
    }).compile()

    BaseTest.app = await moduleRef.createNestApplication().init()
    BaseTest.userToken = await BaseTest.getUserToken('skore-front', 'skore', 'skore123')
    BaseTest.clientToken = await BaseTest.getClientToken()

    const { data: noAccessClient } = await axios.post(
      `${process.env.KEYCLOAK_SERVER_URL}/auth/realms/skore/protocol/openid-connect/token`,
      stringify({
        client_id: 'no-access-client',
        client_secret: '0f9d7137-0f35-4cdf-8c33-1b331ca349c1',
        grant_type: 'client_credentials',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 15000 },
    )

    BaseTest.noAccessToken = noAccessClient.access_token
  }

  before() {
    expect.hasAssertions()
  }

  async httpServerForModule(moduleBuilder: TestingModuleBuilder): Promise<SuperTest<request.Test>> {
    const moduleRef = await moduleBuilder.compile()
    const app = await moduleRef.createNestApplication().init()
    return request(app.getHttpServer())
  }

  private static async getUserToken(clientId: string, username: string, password: string) {
    const { data } = await axios.post(
      `${process.env.KEYCLOAK_SERVER_URL}/auth/realms/skore/protocol/openid-connect/token`,
      stringify({
        client_id: clientId,
        grant_type: 'password',
        username,
        password,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 15000 },
    )

    return data?.access_token
  }

  private static async getClientToken() {
    const { data } = await axios.post(
      `${process.env.KEYCLOAK_SERVER_URL}/auth/realms/skore/protocol/openid-connect/token`,
      stringify({
        client_id: process.env.KEYCLOAK_FOLDER_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_FOLDER_CLIENT_SECRET,
        grant_type: 'client_credentials',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 15000 },
    )

    return data?.access_token
  }

  token(): string {
    return BaseTest.userToken
  }

  clientToken(): string {
    return BaseTest.clientToken
  }

  noAccessToken(): string {
    return BaseTest.noAccessToken
  }

  fakeToken(): string {
    return `123123.${Buffer.from(
      `{"iss": "${process.env.KEYCLOAK_SERVER_URL}/auth/realms/skore"}`,
    ).toString('base64')}`
  }

  get<TInput = any, TResult = TInput>(type: Type<TInput>): TResult {
    return BaseTest.app.get(type)
  }
}
