import { suite, test } from '@testdeck/jest'
import { BaseTest } from '../base-test'
import { CreatePermissionService } from '../../src/service'
import { ResourceFactory } from '../factory'
import { ScopeType } from '../../src/domain'

@suite('[Keycloak Module] Create Permission Service')
export class CreatePermissionServiceTest extends BaseTest {
  @test()
  async 'Given a permission with users and groups then create'() {
    const resource = await new ResourceFactory().create()
    const service = super.get(CreatePermissionService)
    const response = await service.perform(super.token(), {
      resourceId: resource.id,
      scope: ScopeType.VIEW,
      groups: ['Skoreans'],
      users: ['24b0a4bf-e796-4ede-9257-734fa0314a40'],
    })

    expect(response.id).toBeDefined()
    expect(response.scope).toEqual(ScopeType.VIEW)
    expect(response.name).toEqual(`${resource.id}_${ScopeType.VIEW}`)
    expect(response.users).toHaveLength(1)
    expect(response.groups).toHaveLength(1)
  }

  @test()
  async 'Given a permission without resourceId then throw error'() {
    const service = super.get(CreatePermissionService)

    try {
      await service.perform(super.token(), {
        resourceId: null,
        scope: ScopeType.EDIT,
        users: ['12345'],
      })
    } catch ([error]) {
      expect(error.constraints.isNotEmpty).toEqual('resourceId should not be empty')
    }
  }

  @test()
  async 'Given a permission without users and groups then throw error'() {
    const service = super.get(CreatePermissionService)

    try {
      await service.perform(super.token(), { resourceId: '12345', scope: ScopeType.VIEW })
    } catch ([error]) {
      expect(error.constraints.arrayNotEmpty).toEqual('Users or groups should not be empty')
    }
  }
}
