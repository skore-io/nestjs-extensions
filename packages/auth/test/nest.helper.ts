import { INestApplication, Type } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import request, { SuperTest } from 'supertest'
import { OAuth2Client } from 'google-auth-library'
import { WorkspaceClient } from '../src/client'
import { SecurityModule } from '../src/security.module'
import { Company, User } from '../src/domain'

export abstract class NestHelper {
  static app: INestApplication
  static httpServer: any

  static async before(): Promise<void> {
    const moduleRef = await Test.createTestingModule({
      imports: [SecurityModule],
    })
      .overrideProvider(ConfigService)
      .useValue({ get: () => 'https://knowledge-staging.skore.io' })
      .overrideProvider(WorkspaceClient)
      .useValue({
        getUser: () => {
          return {
            id: '1',
            companyId: '114',
            role: 'admin',
            name: 'Bilu',
          } as User
        },
        getCompany: () => {
          return {
            id: '114',
          } as Company
        },
      })
      .overrideProvider(OAuth2Client)
      .useValue({
        verifyIdToken: ({ idToken }) => {
          if (idToken !== 'VALID_PROJECT' && idToken !== 'INVALID_PROJECT')
            throw new Error('Invalid token')

          return {
            getPayload: () => ({
              email: `${
                idToken === 'INVALID_PROJECT' ? 'invalid' : 'project1'
              }@appspot.gserviceaccount.com`,
              email_verified: true,
            }),
          }
        },
      })
      .compile()

    NestHelper.app = await moduleRef.createNestApplication().init()
    NestHelper.httpServer = this.app.getHttpServer()
  }

  get<TInput = any, TResult = TInput>(type: Type<TInput>): TResult {
    return NestHelper.app.get(type)
  }

  server(): SuperTest<request.Test> {
    return request(NestHelper.httpServer)
  }
}
