import { suite, test } from '@testdeck/jest'
import { FindUserByIdService } from '../../src/service'
import { BaseTest } from '../base-test'

@suite('[Keycloak Module] Find User By Id Service')
export class FindUserByIdServiceTest extends BaseTest {
  @test()
  async 'Given an existing user then return the info'() {
    const service = super.get(FindUserByIdService)

    const user = await service.perform(super.token(), '24b0a4bf-e796-4ede-9257-734fa0314a40')

    expect(user.id).toBeDefined()
    expect(user.username).toEqual('skore')
    expect(user.email).toEqual('apps@skore.io')
    expect(user.name).toEqual('Skore One')
  }

  @test()
  async 'Given a not found user then throw error'() {
    const service = super.get(FindUserByIdService)

    try {
      await service.perform(super.token(), '24b0a4bf-e796-4ede-9257-734fa0314a41')
    } catch (error) {
      expect(error.message).toEqual('User not found')
    }
  }
}
