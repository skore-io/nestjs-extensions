import { suite, test } from '@testdeck/jest'
import { CreatePermissionService, FindResourcePermissionsService } from '../../src/service'
import { BaseTest } from '../base-test'
import { Permission, ScopeType } from '../../src/domain'
import { ResourceFactory } from '../factory'

@suite('[Keycloak Module] Find Resource Permissions Service')
export class FindResourcePermissionsServiceTest extends BaseTest {
  @test()
  async 'Given an existing resourceId then list permissions'() {
    const resource = await new ResourceFactory().create()
    await this.createPermission(resource.name)
    const service = super.get(FindResourcePermissionsService)

    const response = await service.perform(super.token(), resource.name)

    expect(response).toHaveLength(1)
    expect(response[0].id).toBeDefined()
  }

  @test()
  async 'Given a non existing resource then throw error'() {
    const service = super.get(FindResourcePermissionsService)

    try {
      await service.perform(super.token(), 'bilu')
    } catch (error) {
      expect(error.message).toEqual('Resource not found')
    }
  }

  private async createPermission(resourceName: string): Promise<Permission> {
    const service = super.get(CreatePermissionService)
    return service.perform(super.token(), resourceName, {
      scope: ScopeType.VIEW,
      groups: ['Skoreans'],
      users: ['skore'],
    })
  }
}
