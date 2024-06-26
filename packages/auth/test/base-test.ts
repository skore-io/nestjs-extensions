import request from 'supertest'
import TestAgent from 'supertest/lib/agent'
import { INestApplication, Type } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { KeycloakClient, WorkspaceClient } from '../src/client'
import { UserRole } from '../src/enum'
import { AuthModule } from '../src/auth.module'

export abstract class BaseTest {
  static app: INestApplication
  static httpServer: any

  static async before(): Promise<void> {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(WorkspaceClient)
      .useValue({
        getUser: () => ({
          id: '1',
          companyId: '114',
          name: 'Bilu',
          role: UserRole.admin,
          sessionId: 99,
        }),
        getCompany: () => ({
          id: '114',
        }),
      })
      .overrideProvider(KeycloakClient)
      .useValue({
        validateToken: () => ({
          active: true,
        }),
      })
      .compile()

    BaseTest.app = await moduleRef.createNestApplication().init()
    BaseTest.httpServer = this.app.getHttpServer()
  }

  get<TInput = any, TResult = TInput>(type: Type<TInput>): TResult {
    return BaseTest.app.get(type)
  }

  server(): TestAgent {
    return request(BaseTest.httpServer)
  }
}
