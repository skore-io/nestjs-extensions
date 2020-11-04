import { suite, test } from '@testdeck/jest'
import { ValidateAccessTokenService } from '../../src/service'
import { BaseTest } from '../base-test'

@suite('[Keycloak Module] Validate Access Token Service')
export class ValidateAccessTokenServiceTest extends BaseTest {
  @test()
  async 'Given a valid access token then return true'() {
    const service = super.get(ValidateAccessTokenService)

    const isValidToken = await service.perform('skore', super.token())

    expect(isValidToken).toBeTruthy()
  }

  @test()
  async 'Given an invalid access token then return false'() {
    const service = super.get(ValidateAccessTokenService)

    const isValidToken = await service.perform('skore', super.fakeToken())

    expect(isValidToken).toBeFalsy()
  }
}
