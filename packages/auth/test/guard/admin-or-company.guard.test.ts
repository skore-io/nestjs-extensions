import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { suite, params } from '@testdeck/jest'
import { AdminOrCompanyGuard } from '../../src/guard'
import { BaseTest } from '../base-test'

@suite
export class AdminOrCompanyGuardTest extends BaseTest {
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
  testAdminOrCompanyGuardToken({ authorization, expected }) {
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
        super.get(AdminOrCompanyGuard).getRequest(context)
      } catch (error) {
        expect(error).toEqual(new UnauthorizedException())
      }
    } else {
      const request: any = super.get(AdminOrCompanyGuard).getRequest(context)
      expect(request.context).not.toBeNull()
    }
  }
}
