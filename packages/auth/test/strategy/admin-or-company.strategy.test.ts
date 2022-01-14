import { ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { suite, test } from '@testdeck/jest'
import jwt from 'jsonwebtoken'
import { BaseTest } from '../base-test'
import { User, Company } from '../../src/domain'
import { UserRole, UserOrCompanyAlg } from '../../src/enum'
import { AdminOrCompanyStrategy as Strategy } from '../../src/strategy'

@suite('[Auth] Admin Or Company Strategy')
export class AdminOrCompanyStrategy extends BaseTest {
  private readonly user: User = { id: '1', name: 'Bilu', role: UserRole.admin } as User
  private readonly company: Company = { id: '114' }

  @test
  async 'Given a company with valid token, then return success'() {
    const context = { getHandler: () => [] } as unknown as ExecutionContext
    jest.spyOn(this.get(Reflector), 'get').mockReturnValue([])

    const companyToken = jwt.sign({ companyId: '114' }, 'secretkey', { algorithm: 'HS384' })
    const companyStrategy = await super.get(Strategy).validate({ context }, companyToken)

    expect(companyStrategy.id).toEqual(this.company.id)
  }

  @test
  async 'Given an user with valid role, then return success'() {
    const context = { getHandler: () => [] } as unknown as ExecutionContext
    jest.spyOn(this.get(Reflector), 'get').mockReturnValue([UserRole.admin])

    const userToken = jwt.sign(this.user, 'secretkey', { algorithm: UserOrCompanyAlg.USER })
    const userStrategy = await super.get(Strategy).validate({ context }, userToken)

    expect(userStrategy.id).toEqual(this.user.id)
  }

  @test
  async 'Given an user with valid role and strategy with empty roles, then return success'() {
    const context = { getHandler: () => [] } as unknown as ExecutionContext
    jest.spyOn(this.get(Reflector), 'get').mockReturnValue(undefined)

    const userToken = jwt.sign(this.user, 'secretkey', { algorithm: UserOrCompanyAlg.USER })
    const userStrategy = await super.get(Strategy).validate({ context }, userToken)

    expect(userStrategy.id).toEqual(this.user.id)
  }

  @test
  async 'Given an user with invalid role, then throw error'() {
    try {
      const context = { getHandler: () => [] } as unknown as ExecutionContext
      jest.spyOn(this.get(Reflector), 'get').mockReturnValue([UserRole.student])

      const userToken = jwt.sign(this.user, 'secretkey', { algorithm: UserOrCompanyAlg.USER })
      await super.get(Strategy).validate({ context }, userToken)
    } catch (error) {
      expect(error).toEqual(new ForbiddenException())
    }
  }
}
