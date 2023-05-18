/* eslint-disable @typescript-eslint/ban-ts-comment */
import { suite, test } from '@testdeck/jest'
import { ServiceStrategy } from '../../src/strategy'
import { UnauthorizedException } from '@nestjs/common'
import { KeycloakClient } from '../../src/client'

@suite('[Auth] Service Strategy')
export class ServiceStrategyTest {
  private keycloakClient: Partial<KeycloakClient>

  before() {
    this.keycloakClient = {
      validateToken: jest.fn().mockResolvedValue({
        active: true,
      }),
    }
  }

  @test
  async 'Validate service token when is valid'() {
    const fakeToken = 'token'

    const strategy = new ServiceStrategy(
      // @ts-ignore
      this.keycloakClient,
    )

    expect(await strategy.validate(null, fakeToken)).toEqual(true)
  }

  @test
  async 'Validate service token when is invalid'() {
    const fakeToken = 'token'

    this.keycloakClient.validateToken = jest.fn().mockResolvedValue({
      active: false,
    })

    const strategy = new ServiceStrategy(
      // @ts-ignore
      this.keycloakClient,
    )

    try {
      await strategy.validate(null, fakeToken)
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedException)
    }
  }
}
