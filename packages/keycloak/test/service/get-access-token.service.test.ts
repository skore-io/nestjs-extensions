import { suite, test, timeout } from '@testdeck/jest'
import { GetAccessTokenService } from '../../src/service'
import { BaseTest } from '../base-test'

@suite('[Keycloak Module] Get Access Token Service')
export class GetAccessTokenServiceTest extends BaseTest {
  @test(timeout(10000))
  async 'Given an existing username then return access token'() {
    const service = super.get(GetAccessTokenService)

    process.env.KEYCLOAK_CLIENT_ID = 'admin-cli'

    const accessToken = await service.perform('master', 'admin', 'admin')

    expect(accessToken).toBeDefined()
  }

  @test(timeout(10000))
  async 'Given an invalid password then throw error'() {
    const service = super.get(GetAccessTokenService)

    try {
      await service.perform('master', 'admin', 'invalid-password')
    } catch (e) {
      expect(e.message).toEqual('Request failed with status code 401')
    }
  }

  @test(timeout(10000))
  async 'Given a non existing username then throw error'() {
    const service = super.get(GetAccessTokenService)

    try {
      await service.perform('master', 'invalid-username', 'admin')
    } catch (e) {
      expect(e.message).toEqual('Request failed with status code 401')
    }
  }
}
