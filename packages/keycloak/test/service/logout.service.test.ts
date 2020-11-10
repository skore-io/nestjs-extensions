import { suite, test, timeout } from '@testdeck/jest'
import { FindUserService, LoginService, LogoutService } from '../../src/service'
import { BaseTest } from '../base-test'

@suite('[Keycloak Module] Logout Service')
export class LogoutServiceTest extends BaseTest {
  @test(timeout(10000))
  async 'Given a valid access token then invalidate it'() {
    const logoutService = super.get(LogoutService)
    const loginService = super.get(LoginService)
    const findUserService = super.get(FindUserService)

    const result = await loginService.perform('master', 'admin-cli', 'admin', 'admin')

    await logoutService.perform('master', 'admin-cli', result.accessToken, result.refreshToken)

    try {
      await findUserService.perform('master', result.accessToken)
    } catch (error) {
      expect(error).toBeDefined()
    }
  }

  @test(timeout(10000))
  async 'Given a invalid refresh token then throw error'() {
    const logoutService = super.get(LogoutService)

    try {
      await logoutService.perform('master', 'admin-cli', 'accessToken', 'refreshToken')
    } catch (error) {
      expect(error.message).toEqual('Request failed with status code 400')
    }
  }
}
