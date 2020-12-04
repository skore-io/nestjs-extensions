import { suite, test } from '@testdeck/jest'
import * as faker from 'faker'
import { GetClientToken } from '../../src/client'
import { User } from '../../src/domain'
import { GetResourcePermissionsService } from '../../src/service'
import { BaseTest } from '../base-test'
import { PolicyFactory, UserFactory } from '../factory'

@suite('[Keycloak Module] Get Permissions Service')
export class GetResourcePermissionsServiceTest extends BaseTest {
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
      expect(error.message).toEqual('Request failed with status code 403')
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
