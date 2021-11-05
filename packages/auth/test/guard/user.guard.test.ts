import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { suite, params, test } from '@testdeck/jest'
import { User } from '../../src/domain'
import { WorkspaceClient } from '../../src/client'
import { UserGuard } from '../../src/guard'
import { NestHelper } from '../nest.helper'

@suite('[Guard] User Guard')
export class UserGuardTest extends NestHelper {
  @params(
    {
      authorization: '',
      expected: false,
      role: 'admin',
    },
    '[User admin] No authorization header should return error',
  )
  @params(
    {
      authorization: 'bilu',
      expected: false,
      role: 'admin',
    },
    '[User admin] An authorization header without bearer should return false',
  )
  @params(
    {
      authorization: 'Bearer SHOULD_ASSERT_OK',
      expected: true,
      role: 'admin',
    },
    '[User admin] A valid token should return true',
  )
  @params(
    {
      authorization: '',
      expected: false,
      role: 'student',
    },
    '[User student] No authorization header should return error',
  )
  @params(
    {
      authorization: 'bilu',
      expected: false,
      role: 'student',
    },
    '[User student] An authorization header without bearer should return false',
  )
  @params(
    {
      authorization: 'Bearer SHOULD_ASSERT_OK',
      expected: true,
      role: 'student',
    },
    '[User student] A valid token should return true',
  )
  async testUserGuardToken({ authorization, role, expected }) {
    const userGuard = this.get(UserGuard)

    jest.spyOn(this.get(WorkspaceClient), 'getUser').mockResolvedValue({
      id: '1',
      companyId: '114',
      role,
      name: 'Bilu',
    } as User)

    const context = ({
      getArgByIndex: () => [],
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization,
          },
        }),
      }),
      getHandler: () => [],
    } as unknown) as ExecutionContext

    jest.spyOn(this.get(Reflector), 'get').mockReturnValue([role])

    const guardCanActivate = await userGuard.canActivate(context)

    expect(guardCanActivate).toBe(expected)
  }

  @test
  async 'A user with different role should return false'() {
    const userGuard = this.get(UserGuard)

    jest.spyOn(this.get(WorkspaceClient), 'getUser').mockResolvedValue({
      id: '1',
      companyId: '114',
      role: 'student',
      name: 'Bilu',
    } as User)

    const context = ({
      getArgByIndex: () => [],
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer SHOULD_ASSERT_OK',
          },
        }),
      }),
      getHandler: () => [],
    } as unknown) as ExecutionContext

    jest.spyOn(this.get(Reflector), 'get').mockReturnValue(['admin'])

    const guardCanActivate = await userGuard.canActivate(context)

    expect(guardCanActivate).toBe(false)
  }

  @test
  async 'A validation with more than one role should work'() {
    const userGuard = this.get(UserGuard)

    jest.spyOn(this.get(WorkspaceClient), 'getUser').mockResolvedValue({
      id: '1',
      companyId: '114',
      role: 'student',
      name: 'Bilu',
    } as User)

    const context = ({
      getArgByIndex: () => [],
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer SHOULD_ASSERT_OK',
          },
        }),
      }),
      getHandler: () => [],
    } as unknown) as ExecutionContext

    jest.spyOn(this.get(Reflector), 'get').mockReturnValue(['admin', 'student'])

    const guardCanActivate = await userGuard.canActivate(context)

    expect(guardCanActivate).toBe(true)
  }
}
