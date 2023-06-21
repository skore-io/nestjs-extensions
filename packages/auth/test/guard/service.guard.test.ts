import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { params, suite } from '@testdeck/jest'
import { ServiceGuard } from '../../src/guard'
import { BaseTest } from '../base-test'

@suite
export class ServiceGuardTest extends BaseTest {
  @params(
    {
      authorization: '',
      expected: 'error',
    },
    'No authorization header should return error',
  )
  @params(
    {
      authorization: 'bilu',
      expected: 'error',
    },
    'An authorization header without bearer should return false',
  )
  @params(
    {
      authorization: 'Bearer SHOULD_ASSERT_OK',
      expected: 'success',
    },
    'A valid token should return true',
  )
  testCompanyGuardToken({ authorization, expected }) {
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
        super.get(ServiceGuard).getRequest(context)
      } catch (error) {
        expect(error).toEqual(new UnauthorizedException())
      }
    } else {
      const request: any = super.get(ServiceGuard).getRequest(context)
      expect(request.context).not.toBeNull()
    }
  }
}
