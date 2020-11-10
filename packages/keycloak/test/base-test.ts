import { INestApplication, Type } from '@nestjs/common'
import { Test, TestingModuleBuilder } from '@nestjs/testing'
import axios from 'axios'
import { stringify } from 'qs'
import request, { SuperTest } from 'supertest'
import { KeycloakModule } from '../src'

export abstract class BaseTest {
  static app: INestApplication
  static token: string
  static noAccessToken: string
  static commonUserAccessToken: string

  static async before() {
    jest.setTimeout(30000)

    const response = await axios.post(
      `${process.env.KEYCLOAK_SERVER_URL}/auth/realms/skore/protocol/openid-connect/token`,
      stringify({
        client_id: 'player',
        client_secret: '436db9f9-d49b-4c83-9480-8e38d21570c6',
        grant_type: 'client_credentials',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 15000 },
    )

    const moduleRef = await Test.createTestingModule({
      imports: [KeycloakModule],
    }).compile()

    BaseTest.app = await moduleRef.createNestApplication().init()
    BaseTest.token = response.data.access_token

    const noAccessClient = await axios.post(
      `${process.env.KEYCLOAK_SERVER_URL}/auth/realms/skore/protocol/openid-connect/token`,
      stringify({
        client_id: 'no-access-client',
        client_secret: '0f9d7137-0f35-4cdf-8c33-1b331ca349c1',
        grant_type: 'client_credentials',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 15000 },
    )

    BaseTest.noAccessToken = noAccessClient.data.access_token

    const commonUser = await axios.post(
      `${process.env.KEYCLOAK_SERVER_URL}/auth/realms/master/protocol/openid-connect/token`,
      stringify({
        client_id: 'admin-cli',
        grant_type: 'password',
        username: 'admin',
        password: 'admin',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 15000 },
    )

    BaseTest.commonUserAccessToken = commonUser.data.access_token
  }

  before() {
    expect.hasAssertions()
  }

  async httpServerForModule(moduleBuilder: TestingModuleBuilder): Promise<SuperTest<request.Test>> {
    const moduleRef = await moduleBuilder.compile()
    const app = await moduleRef.createNestApplication().init()
    return request(app.getHttpServer())
  }

  token(): string {
    return BaseTest.token
  }

  noAccessToken(): string {
    return BaseTest.noAccessToken
  }

  fakeToken(): string {
    return `123123.${Buffer.from(
      `{"iss": "${process.env.KEYCLOAK_SERVER_URL}/auth/realms/skore"}`,
    ).toString('base64')}`
  }

  commonUserAccessToken(): string {
    return BaseTest.commonUserAccessToken
  }

  get<TInput = any, TResult = TInput>(type: Type<TInput>): TResult {
    return BaseTest.app.get(type)
  }
}
