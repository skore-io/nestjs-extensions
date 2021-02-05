import { suite, test } from '@testdeck/jest'
import { User } from '../../src/domain'
import { GetResourcePermissionsService } from '../../src/service'
import { BaseTest } from '../base-test'
import { PolicyFactory } from '../factory'

@suite('[Keycloak Module] Get Permissions Service')
export class GetResourcePermissionsServiceTest extends BaseTest {
  private user: User

  async before() {
    await new PolicyFactory(super.clientToken()).create(['24b0a4bf-e796-4ede-9257-734fa0314a40'])

    this.user = new User('username', 'name', 'email')
    this.user.accessToken = super.clientToken()
  }

  @test()
  async 'Given resources list then those with permission are returned'() {
    const service = super.get(GetResourcePermissionsService)

    const resources = await service.perform(this.user, ['Movies', 'Downloads'], 'create')

    expect(resources).toEqual(['Movies'])
  }

  @test()
  async 'Given resources list without permission then throw error'() {
    const service = super.get(GetResourcePermissionsService)

    try {
      await service.perform(this.user, ['Movies'], 'delete')
    } catch (error) {
      expect(error.message).toEqual('Permission Denied')
    }
  }

  @test()
  async 'Given null scope then throw error'() {
    const service = super.get(GetResourcePermissionsService)

    try {
      await service.perform(this.user, ['Movies'], null)
    } catch (error) {
      expect(error.message).toEqual('Invalid params')
    }
  }
}
