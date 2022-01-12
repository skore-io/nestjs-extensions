import { ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { suite, test } from '@testdeck/jest'
import { BaseTest } from '../base-test'
import { User, Company } from '../../src/domain'
import { UserRole } from '../../src/enum'
import { UserOrCompanyStrategy as Strategy } from '../../src/strategy'

@suite('[Auth] User Or Company Strategy')
export class UserOrCompanyStrategy extends BaseTest {
  private readonly user: User = { id: '1', name: 'Bilu', role: UserRole.admin } as User
  private readonly company: Company = { id: '114' }

  @test
  async 'Given an company with valid token, then return success'() {
    const context = { getHandler: () => [] } as unknown as ExecutionContext
    jest.spyOn(this.get(Reflector), 'get').mockReturnValue([])

    const companyStrategy = await super.get(Strategy).validate({ context }, '114')

    expect(companyStrategy.id).toEqual(this.company.id)
  }

  @test
  async 'Given an user with valid role, then return success'() {
    const context = { getHandler: () => [] } as unknown as ExecutionContext
    jest.spyOn(this.get(Reflector), 'get').mockReturnValue([UserRole.admin])

    const userStrategy = await super.get(Strategy).validate({ context }, '1')

    expect(userStrategy.id).toEqual(this.user.id)
  }

  @test
  async 'Given an user with valid role and strategy with empty roles, then return success'() {
    const context = { getHandler: () => [] } as unknown as ExecutionContext
    jest.spyOn(this.get(Reflector), 'get').mockReturnValue(undefined)

    const userStrategy = await super.get(Strategy).validate({ context }, '1')

    expect(userStrategy.id).toEqual(this.user.id)
  }

  @test
  async 'Given an user with invalid role, then throw error'() {
    try {
      const context = { getHandler: () => [] } as unknown as ExecutionContext
      jest.spyOn(this.get(Reflector), 'get').mockReturnValue([UserRole.student])

      await super.get(Strategy).validate({ context }, '1')
    } catch (error) {
      expect(error).toEqual(new ForbiddenException())
    }
  }
}
