import { suite, test } from '@testdeck/jest'
import * as faker from 'faker'
import { GetClientToken } from '../../src/client'
import { User } from '../../src/domain'
import { CheckResourcePermissionService } from '../../src/service'
import { BaseTest } from '../base-test'
import { PolicyFactory, UserFactory } from '../factory'

@suite('Check Resource Permission Service')
export class CheckResourcePermissionServiceTest extends BaseTest {
  private user: User

  async before() {
    const username = faker.name.firstName()
    const {
      data: { access_token: accessToken },
    } = await super.get(GetClientToken).get('skore')

    const userId = await new UserFactory(super.commonUserAccessToken()).create(username)

    const [token] = await Promise.all([
      new UserFactory(super.commonUserAccessToken()).getToken(username),
      new PolicyFactory(accessToken).create([userId]),
    ])
    this.user = new User()
    this.user.accessToken = token
  }
  @test()
  async 'Given an user with access in resource dont throws an error'() {
    const service = super.get(CheckResourcePermissionService)
    await service.perform(this.user, ['Movies', 'Downloads'], 'create')
  }

  @test()
  async 'Given an user without access in resource then throws an error'() {
    expect.assertions(1)
    const service = super.get(CheckResourcePermissionService)
    try {
      await service.perform(this.user, ['Downloads'], 'create')
    } catch (error) {
      expect(error.message).toEqual('Permission Denied')
    }
  }
}