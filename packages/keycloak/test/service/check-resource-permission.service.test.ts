import { suite, test } from '@testdeck/jest'
import { ScopeType, User } from '../../src/domain'
import { CheckResourcePermissionService } from '../../src/service'
import { BaseTest } from '../base-test'
import { PolicyFactory } from '../factory'

@suite('Check Resource Permission Service')
export class CheckResourcePermissionServiceTest extends BaseTest {
  private user: User

  async before() {
    await new PolicyFactory(super.clientToken()).create(['24b0a4bf-e796-4ede-9257-734fa0314a40'])

    this.user = new User('username', 'name', 'email')
    this.user.accessToken = super.clientToken()
  }

  @test()
  async 'Given an user with access in resource dont throws an error'() {
    const service = super.get(CheckResourcePermissionService)
    await service.perform(this.user, ['Movies', 'Downloads'], ScopeType.EDIT)
  }

  @test()
  async 'Given an user without access in resource then throws an error'() {
    expect.assertions(1)
    const service = super.get(CheckResourcePermissionService)

    try {
      await service.perform(this.user, ['Downloads'], ScopeType.EDIT)
    } catch (error) {
      expect(error.message).toEqual('Permission Denied')
    }
  }
}
