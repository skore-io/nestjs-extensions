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

  async before() {
    const moduleRef = await Test.createTestingModule({
      imports: [GoogleAuthModule],
    }).compile()

    this.app = moduleRef.createNestApplication()
    this.app = await this.app.init()
  }

  @test
  async '[request] The fetchToken method should be called properly'() {
    const fetchToken = jest
      .spyOn(this.app.get(AuthedRequest), 'fetchToken')
      .mockResolvedValue('token')

    jest.spyOn(HttpService.prototype, 'request').mockImplementationOnce(() =>
      of({
        data: { bilu: 'bilu' },
        status: 200,
        statusText: 'bilu',
        headers: {},
        config: {},
      }),
    )

    await this.app.get(AuthedRequest).request('https://bilu.com', RequestMethodEnum.POST)

    expect(fetchToken).toHaveBeenCalledWith('https://bilu.com')
  }

  @test
  async '[request] The request method should be called properly'() {
    jest.spyOn(this.app.get(AuthedRequest), 'fetchToken').mockResolvedValue('token')

    const request = jest.spyOn(HttpService.prototype, 'request').mockImplementationOnce(() =>
      of({
        data: { bilu: 'bilu' },
        status: 200,
        statusText: 'bilu',
        headers: {},
        config: {},
      }),
    )

    await this.app.get(AuthedRequest).request('https://bilu.com', RequestMethodEnum.POST)

    expect(request).toHaveBeenCalledWith({
      headers: { Authorization: 'Bearer token', 'Content-Type': 'application/json' },
      method: 'post',
      url: 'https://bilu.com',
    })
  }

  @test
  async '[graphql] The fetchToken method should be called properly'() {
    const fetchToken = jest
      .spyOn(this.app.get(AuthedRequest), 'fetchToken')
      .mockResolvedValue('token')

    jest.spyOn(HttpService.prototype, 'post').mockImplementationOnce(() =>
      of({
        data: { bilu: 'bilu' },
        status: 200,
        statusText: 'bilu',
        headers: {},
        config: {},
      }),
    )

    await this.app.get(AuthedRequest).graphql('https://bilu.com', `query { test() }`)

    expect(fetchToken).toHaveBeenCalledWith('https://bilu.com')
  }

  @test
  async '[graphql] The request method should be called properly'() {
    jest.spyOn(this.app.get(AuthedRequest), 'fetchToken').mockResolvedValue('token')

    const request = jest.spyOn(HttpService.prototype, 'post').mockImplementationOnce(() =>
      of({
        data: { bilu: 'bilu' },
        status: 200,
        statusText: 'bilu',
        headers: {},
        config: {},
      }),
    )

    await this.app.get(AuthedRequest).graphql('https://bilu.com', 'query { test() }')

    expect(request).toHaveBeenCalledWith(
      'https://bilu.com',
      {
        query: 'query { test() }',
        variables: null,
      },
      { headers: { Authorization: 'Bearer token', 'Content-Type': 'application/json' } },
    )
  }
}
