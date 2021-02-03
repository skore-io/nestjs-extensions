import { suite, test, timeout } from '@testdeck/jest'
import { FindUserService } from '../../src/service'
import { BaseTest } from '../base-test'

@suite('[Keycloak Module] Find User Service')
export class FindUserServiceTest extends BaseTest {
  @test(timeout(10000))
  async 'Given a valid access token then return the user info'() {
    const service = super.get(FindUserService)

    const user = await service.perform('skore', super.token())

    expect(user.id).toBeDefined()
    expect(user.username).toEqual('skore')
    expect(user.email).toEqual('apps@skore.io')
    expect(user.name).toEqual('Skore One')
    expect(user.environmentId).toEqual('5f0498070bfd264e7662b434')
    expect(user.accessToken).toEqual(super.token())
  }

  @test(timeout(10000))
  async 'Given an invalid access token then throw error'() {
    const service = super.get(FindUserService)

    try {
      await service.perform('skore', super.fakeToken())
    } catch (error) {
      expect(error.message).toEqual('Token verification failed')
    }
  }

  @test(timeout(10000))
  async 'Given a blank access token then throw error'() {
    const service = super.get(FindUserService)

    try {
      await service.perform('skore', null)
    } catch (error) {
      expect(error.message).toEqual('Token verification failed')
    }
  }
}
