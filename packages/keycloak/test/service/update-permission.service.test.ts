import { HttpService } from '@nestjs/common'
import { suite, test } from '@testdeck/jest'
import { Error } from '../../src/errors'
import { Permission, ScopeType } from '../../src/domain'
import { CreatePermissionService, UpdatePermissionService } from '../../src/service'
import { BaseTest } from '../base-test'
import { ResourceFactory } from '../factory'

@suite('[Keycloak Module] Update Permission Service')
export class UpdatePermissionServiceTest extends BaseTest {
  @test()
  async 'Given a permission to update then update'() {
    const permission = await this.createPermission()

    permission.users = []
    const service = super.get(UpdatePermissionService)
    await service.perform(super.token(), permission)

    const updatedPermission = await this.findPermission(permission)

    expect(updatedPermission.scope).toEqual(ScopeType.VIEW)
    expect(updatedPermission.name).toEqual(`${permission.resourceId}_${ScopeType.VIEW}`)
    expect(updatedPermission.users).toHaveLength(0)
    expect(updatedPermission.groups).toHaveLength(1)
  }

  @test()
  async 'Given a not fout user throws UNPROCESSABLE_ENTITY'() {
    const permission = await this.createPermission()

    permission.users = ['user-not-found']
    const service = super.get(UpdatePermissionService)
    const promise = service.perform(super.token(), permission)

    await expect(promise).rejects.toThrow(Error.UNPROCESSABLE_ENTITY)
  }

  @test()
  async 'Given a permission not found then throws'() {
    const permission = await this.createPermission()
    permission.id = 'wrong'

    const service = super.get(UpdatePermissionService)
    const promise = service.perform(super.token(), permission)

    await expect(promise).rejects.toThrow('Request failed with status code 404')
  }

  private async createPermission(): Promise<Permission> {
    const resource = await new ResourceFactory().create()

    const service = super.get(CreatePermissionService)
    return service.perform(super.token(), resource.name, {
      scope: ScopeType.VIEW,
      groups: ['Skoreans'],
      users: ['24b0a4bf-e796-4ede-9257-734fa0314a40'],
    })
  }

  private async findPermission(permission: Permission): Promise<Permission> {
    const client = super.get(HttpService)
    const { data } = await client
      .get(
        `${process.env.KEYCLOAK_SERVER_URL}/auth/realms/skore/authz/protection/uma-policy?name=${permission.name}`,
        {
          headers: {
            Authorization: `Bearer ${super.clientToken()}`,
          },
        },
      )
      .toPromise()

    return new Permission(
      data[0].name,
      data[0].name.split('_')[0],
      data[0].scopes[0],
      data[0].users,
      data[0].groups,
    )
  }
}
