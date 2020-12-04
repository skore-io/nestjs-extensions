import { suite, test } from '@testdeck/jest'
import * as faker from 'faker'
import { GetClientToken } from '../../src/client'
import { CheckResourcePermissionsService } from '../../src/service'
import { BaseTest } from '../base-test'
import { PolicyFactory, UserFactory } from '../factory'

@suite('Check Resource Permission Service')
export class CheckResourcePermissionsServiceTest extends BaseTest {
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
  async 'Given an user with access in resource dont throw an error'() {
    const service = super.get(CheckResourcePermissionsService)
    await service.perform('skore', this.userToken, ['Movies', 'Downloads'], 'create')
  }

  @test()
  async 'Given an user without access in resource then throws an error'() {
    expect.assertions(1)
    const service = super.get(CheckResourcePermissionsService)
    try {
      await service.perform('skore', this.userToken, ['Downloads'], 'create')
    } catch (error) {
      expect(error.message).toEqual('Permission Denied')
    }
  }
}
