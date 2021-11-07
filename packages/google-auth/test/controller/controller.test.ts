import { Controller, Get } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { suite, test } from '@testdeck/jest'
import { LoginTicket, OAuth2Client } from 'google-auth-library'
import { default as request } from 'supertest'
import { GoogleAuth, GoogleAuthModule } from '../../src'
import { GoogleAuthStrategy } from '../../src/strategy'

@Controller('ctrl1')
class Ctrl1 {
  @Get()
  @GoogleAuth()
  auth(): string {
    return 'auth'
  }
}

@suite('[Controller] Controller')
export class ControllerTest {
  @test
  async 'Given request with valid token then return 200'() {
    const module = await this.moduleRef()
      .overrideProvider(GoogleAuthStrategy)
      .useValue(
        new GoogleAuthStrategy(
          {
            verifyIdToken: () =>
              Promise.resolve({
                getPayload: () => ({
                  email_verified: true,
                  email: 'some-project@appspot.gserviceaccount.com',
                }),
              } as LoginTicket),
          } as unknown as OAuth2Client,
          { get: () => 'some-project@appspot.gserviceaccount.com' } as unknown as ConfigService,
        ),
      )
      .compile()

    const app = await module.createNestApplication().init()

    const response = await request(app.getHttpServer())
      .get('/ctrl1')
      .set('Authorization', 'Bearer valid')

    expect(response.status).toBe(200)
  }

  @test
  async 'Given request with invalid token then return 401'() {
    const module = await this.moduleRef().compile()

    const app = await module.createNestApplication().init()

    const response = await request(app.getHttpServer())
      .get('/ctrl1')
      .set('Authorization', 'Bearer invalid')

    expect(response.status).toBe(401)
  }

  @test
  async 'Given request without token then return 401'() {
    const module = await this.moduleRef().compile()

    const app = await module.createNestApplication().init()

    const response = await request(app.getHttpServer()).get('/ctrl1')

    expect(response.status).toBe(401)
  }

  private moduleRef() {
    return Test.createTestingModule({
      imports: [
        GoogleAuthModule,
        ConfigModule.forRoot({ envFilePath: 'test/config/.env', isGlobal: true }),
      ],
      controllers: [Ctrl1],
    })
  }
}
