import { suite, test, timeout } from '@testdeck/jest'
import { BaseTest } from '../base-test'
import { LoginService, RefreshTokenService } from '../../src/service'

@suite('[Keycloak Module] Refresh Token Service')
export class RefreshTokenServiceTest extends BaseTest {
  @test(timeout(10000))
  async 'Given a valid refresh token then return a new access token'() {
    const refreshTokenService = super.get(RefreshTokenService)
    const loginService = super.get(LoginService)

    const { refreshToken } = await loginService.perform('master', 'admin-cli', 'admin', 'admin')
    const result = await refreshTokenService.perform('master', 'admin-cli', refreshToken)

    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
  }

  @test(timeout(10000))
  async 'Given an invalid refresh token then throw error'() {
    const refreshTokenService = super.get(RefreshTokenService)

    try {
      await refreshTokenService.perform('master', 'admin-cli', 'invalid-refresh-token')
    } catch (e) {
      expect(e.message).toEqual('Request failed with status code 400')
    }
  }
}
