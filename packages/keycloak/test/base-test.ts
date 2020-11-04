import 'reflect-metadata'
import axios from 'axios'
import { stringify } from 'qs'
import { Test } from '@nestjs/testing'
import { INestApplication, Type } from '@nestjs/common'
import { KeycloakModule } from '../src'

export abstract class BaseTest {
  static app: INestApplication
  static token: string

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
  }

  before() {
    expect.hasAssertions()
  }

  token(): string {
    return BaseTest.token
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
