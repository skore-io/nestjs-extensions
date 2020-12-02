import { suite, test } from '@testdeck/jest'
import { BaseTest } from '../base-test'
import * as faker from 'faker'
import { GetClientToken } from '../../src/client'
import { UserFactory, PolicyFactory } from '../factory'
import { GetPermissionsService } from '../../src/service'

@suite('[Keycloak Module] Get Permissions Service')
export class GetPermissionsServiceTest extends BaseTest {
  private userToken: string

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

    this.userToken = token
  }

  @test()
  async 'Given resources list then those with permission are returned'() {
    const service = super.get(GetPermissionsService)

    const resources = await service.perform('skore', this.userToken, ['Movies'], 'create')

    expect(resources).toEqual(['Movies'])
  }

  @test()
  async 'Given resources list without permission then throw error'() {
    const service = super.get(GetPermissionsService)

    try {
      await service.perform('skore', this.userToken, ['Movies'], 'delete')
    } catch (error) {
      expect(error.message).toEqual('Request failed with status code 403')
    }
  }

  @test()
  async 'Given null scope then throw error'() {
    const service = super.get(GetPermissionsService)

    try {
      await service.perform('skore', this.userToken, ['Movies'], null)
    } catch (error) {
      expect(error.message).toEqual('Invalid params')
    }
  }
}
