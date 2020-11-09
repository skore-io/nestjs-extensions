import { suite, test, timeout } from '@testdeck/jest'
import { BaseTest } from '../base-test'
import { KeycloakClient } from '../../src/client'
import { LoginService, LogoutService } from '../../src/service'

@suite('[Keycloak Module] Logout Service')
export class LogoutServiceTest extends BaseTest {
  @test(timeout(10000))
  async 'Given a valid access token then invalidate it'() {
    const logoutService = super.get(LogoutService)
    const loginService = super.get(LoginService)
    const keycloakClient = super.get(KeycloakClient)

    const result = await loginService.perform('master', 'admin-cli', 'admin', 'admin')

    await logoutService.perform('master', 'admin-cli', result.accessToken, result.refreshToken)

    try {
      await keycloakClient.isValidAccessToken('master', result.accessToken)
    } catch (error) {
      expect(error).toBeDefined()
    }
  }
}
