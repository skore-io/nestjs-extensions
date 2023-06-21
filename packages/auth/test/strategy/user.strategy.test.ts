import { suite, test } from '@testdeck/jest'
import { User } from '../../src/domain'
import { UserRole } from '../../src/enum'
import { UserStrategy } from '../../src/strategy'
import { BaseTest } from '../base-test'
import { ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@suite
export class UserStrategyTest extends BaseTest {
  private readonly user: User = { id: '1', name: 'Bilu', role: UserRole.student } as User

  @test
  async 'Given an user with valid role, then return it'() {
    const context = { getHandler: () => [] } as unknown as ExecutionContext
    jest.spyOn(this.get(Reflector), 'get').mockReturnValue([UserRole.admin, UserRole.student])

    const userStrategy = await super.get(UserStrategy).validate({ context }, 'SHOULD_ASSERT_OK')

    expect(userStrategy.id).toEqual(this.user.id)
  }

  @test
  async 'Given no role, then return user'() {
    const context = { getHandler: () => [] } as unknown as ExecutionContext
    jest.spyOn(this.get(Reflector), 'get').mockReturnValue(undefined)

    const userStrategy = await super.get(UserStrategy).validate({ context }, 'SHOULD_ASSERT_OK')

    expect(userStrategy.id).toEqual(this.user.id)
  }

  @test
  async 'Given an user with not allowed role, then throw error'() {
    const context = { getHandler: () => [] } as unknown as ExecutionContext
    jest.spyOn(this.get(Reflector), 'get').mockReturnValue([UserRole.expert])

    try {
      await super.get(UserStrategy).validate({ context }, 'SHOULD_ASSERT_OK')
    } catch (error) {
      expect(error).toEqual(new ForbiddenException())
    }
  }
}
