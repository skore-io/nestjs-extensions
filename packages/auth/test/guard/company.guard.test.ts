import { ExecutionContext } from '@nestjs/common'
import { params, suite } from '@testdeck/jest'
import { CompanyGuard } from '../../src/guard'
import { BaseTest } from '../base-test'

@suite('[Auth] Company Guard')
export class CompanyGuardTest extends BaseTest {
  @params(
    {
      authorization: '',
      expected: false,
    },
    'No authorization header should return error',
  )
  @params(
    {
      authorization: 'bilu',
      expected: false,
    },
    'An authorization header without bearer should return false',
  )
  @params(
    {
      authorization: 'Bearer SHOULD_ASSERT_OK',
      expected: true,
    },
    'A valid token should return true',
  )
  async testCompanyGuardToken({ authorization, expected }) {
    const companyGuard = this.get(CompanyGuard)

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

    const guardCanActivate = await companyGuard.canActivate(context)

    expect(guardCanActivate).toBe(expected)
  }
}
