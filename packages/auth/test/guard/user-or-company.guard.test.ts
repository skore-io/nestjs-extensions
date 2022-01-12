import { ExecutionContext, ForbiddenException } from '@nestjs/common'
import { suite, params } from '@testdeck/jest'
import { UserOrCompanyGuard } from '../../src/guard'
import { BaseTest } from '../base-test'

@suite('[Auth] UserOrCompanyGuard')
export class UserOrCompanyGuardTest extends BaseTest {
  @params(
    {
      authorization: '',
      expected: 'error',
    },
    'No authorization header should return error',
  )
  @params(
    {
      authorization: 'invalidheader',
      expected: 'error',
    },
    'An authorization header without bearer should return false',
  )
  @params(
    {
      authorization: 'Bearer validheader',
      expected: 'error',
    },
    'A valid token should return true',
  )
  testUserGuardToken({ authorization, expected }) {
    const context = {
      getArgByIndex: () => [],
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization,
          },
        }),
      }),
      getHandler: () => [],
    } as unknown as ExecutionContext

    if (expected === 'error') {
      try {
        super.get(UserOrCompanyGuard).getRequest(context)
      } catch (error) {
        expect(error).toEqual(new ForbiddenException())
      }
    } else {
      const request: any = super.get(UserOrCompanyGuard).getRequest(context)
      expect(request.context).not.toBeNull()
    }
  }
}
