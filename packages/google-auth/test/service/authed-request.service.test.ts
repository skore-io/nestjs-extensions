import { suite, test } from '@testdeck/jest'
import { AuthedRequest, GoogleAuthModule } from '../../src'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { of } from 'rxjs'
import { RequestMethodEnum } from '../../src/enum'

@suite('[Service] Authed Request')
export class AuthedRequestTest {
  app: INestApplication
  fetchToken: jest.SpyInstance

  async before() {
    const moduleRef = await Test.createTestingModule({
      imports: [GoogleAuthModule],
    }).compile()

    this.app = moduleRef.createNestApplication()
    this.app = await this.app.init()

    this.fetchToken = jest
      .spyOn(this.app.get(AuthedRequest), 'fetchToken')
      .mockResolvedValue('token')
  }

  @test
  async '[request] Should call methods properly'() {
    const url = 'https://bilu.com'

    const request = jest.spyOn(HttpService.prototype, 'request').mockImplementationOnce(() =>
      of({
        data: { bilu: 'bilu' },
        status: 200,
        statusText: 'bilu',
        headers: {},
        config: {},
      }),
    )

    await this.app.get(AuthedRequest).rest(url, RequestMethodEnum.POST)

    expect(this.fetchToken).toHaveBeenCalledWith(url)
    expect(request).toHaveBeenCalledWith({
      headers: { Authorization: 'Bearer token', 'Content-Type': 'application/json' },
      method: 'post',
      url,
    })
  }

  @test
  async '[graphql] Should call methods properly'() {
    const url = 'https://bilu.com'
    const request = jest.spyOn(HttpService.prototype, 'post').mockImplementationOnce(() =>
      of({
        data: { bilu: 'bilu' },
        status: 200,
        statusText: 'bilu',
        headers: {},
        config: {},
      }),
    )

    await this.app.get(AuthedRequest).graphql(url, `query { test() }`)

    expect(this.fetchToken).toHaveBeenCalledWith(url)
    expect(request).toHaveBeenCalledWith(
      url,
      { query: 'query { test() }' },
      { headers: { Authorization: 'Bearer token', 'Content-Type': 'application/json' } },
    )
  }

  @test
  async '[graphql] Should call request method with variables'() {
    const url = 'https://bilu.com'
    const request = jest.spyOn(HttpService.prototype, 'post').mockImplementationOnce(() =>
      of({
        data: { bilu: 'bilu' },
        status: 200,
        statusText: 'bilu',
        headers: {},
        config: {},
      }),
    )

    await this.app.get(AuthedRequest).graphql(url, `query { test() }`, { company_id: 114 })

    expect(this.fetchToken).toHaveBeenCalledWith(url)
    expect(request).toHaveBeenCalledWith(
      url,
      { query: 'query { test() }', variables: { company_id: 114 } },
      { headers: { Authorization: 'Bearer token', 'Content-Type': 'application/json' } },
    )
  }
}
