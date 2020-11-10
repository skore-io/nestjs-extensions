import { suite, test, timeout } from '@testdeck/jest'
import { LoginService } from '../../src/service'
import { BaseTest } from '../base-test'

@suite('[Keycloak Module] Login Service')
export class LoginServiceTest extends BaseTest {
  @test(timeout(10000))
  async 'Given an existing username then return access token'() {
    const service = super.get(LoginService)

    const result = await service.perform('master', 'admin-cli', 'admin', 'admin')

    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
  }

  @test(timeout(10000))
  async 'Given an invalid password then throw error'() {
    const service = super.get(LoginService)

    try {
      await service.perform('master', 'admin-cli', 'admin', 'invalid-password')
    } catch (e) {
      expect(e.message).toEqual('Request failed with status code 401')
    }
  }

  @test(timeout(10000))
  async 'Given a non existing username then throw error'() {
    const service = super.get(LoginService)

    try {
      await service.perform('master', 'admin-cli', 'invalid-username', 'admin')
    } catch (e) {
      expect(e.message).toEqual('Request failed with status code 401')
    }
  }
}
