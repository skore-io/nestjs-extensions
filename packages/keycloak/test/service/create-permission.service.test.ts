import { suite, test } from '@testdeck/jest'
import { BaseTest } from '../base-test'
import { CreatePermissionService } from '../../src/service'
import { ResourceFactory } from '../factory'
import { ScopeType } from '../../src/domain'

@suite('[Keycloak Module] Create Permission Service')
export class CreatePermissionServiceTest extends BaseTest {
  @test()
  async 'Given an user permission then create'() {
    const resource = await new ResourceFactory().create()
    const service = super.get(CreatePermissionService)
    const response = await service.perform(super.token(), {
      resourceId: resource.id,
      scopes: [ScopeType.VIEW],
      user: '24b0a4bf-e796-4ede-9257-734fa0314a40',
    })

    expect(response.id).toBeDefined()
    expect(response.scopes).toEqual([ScopeType.VIEW])
    expect(response.name).toEqual(`${resource.id}_24b0a4bf-e796-4ede-9257-734fa0314a40`)
  }

  @test()
  async 'Given a group permission then create'() {
    const resource = await new ResourceFactory().create()
    const service = super.get(CreatePermissionService)
    const response = await service.perform(super.token(), {
      resourceId: resource.id,
      scopes: [ScopeType.EDIT],
      group: 'Skoreans',
    })

    expect(response.id).toBeDefined()
    expect(response.scopes).toEqual([ScopeType.EDIT])
    expect(response.name).toEqual(`${resource.id}_Skoreans`)
  }

  @test()
  async 'Given an permission without target then throw error'() {
    const service = super.get(CreatePermissionService)
    const promise = service.perform(super.token(), { resourceId: null, scopes: [] })

    await expect(promise).rejects.toThrow('User or group is required')
  }

  @test()
  async 'Given an permission without resource then throw error'() {
    const service = super.get(CreatePermissionService)
    const promise = service.perform(super.token(), { resourceId: null, scopes: [], user: '12345' })

    await expect(promise).rejects.toThrow('Resource is required')
  }
}
