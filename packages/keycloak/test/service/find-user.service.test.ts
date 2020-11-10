import { suite, test, timeout } from '@testdeck/jest'
import { FindUserService } from '../../src/service'
import { BaseTest } from '../base-test'

@suite('[Keycloak Module] Fid User Service')
export class FindUserServiceTest extends BaseTest {
  @test(timeout(10000))
  async 'Given an valid access token then return the user info'() {
    const service = super.get(FindUserService)

    const user = await service.perform('master', super.commonUserAccessToken())
    expect(user.id).toBeDefined()
    expect(user.username).toEqual('admin')
    expect(user.email).toBeUndefined()
    expect(user.name).toBeUndefined()
    expect(user.organizationId).toBeUndefined()
  }

  @test(timeout(10000))
  async 'Given an invalid access token then throw error'() {
    const service = super.get(FindUserService)

    try {
      await service.perform('master', super.fakeToken())
    } catch (error) {
      expect(error.message).toEqual('Token verification failed')
    }
  }

  @test(timeout(10000))
  async 'Given a blank access token then throw error'() {
    const service = super.get(FindUserService)

    try {
      await service.perform('master', null)
    } catch (error) {
      expect(error.message).toEqual('Token verification failed')
    }
  }
}
