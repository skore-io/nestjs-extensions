import { ExecutionContext, ForbiddenException } from '@nestjs/common'
import { suite, params } from '@testdeck/jest'
import { UserGuard } from '../../src/guard'
import { BaseTest } from '../base-test'

@suite('[Auth] User Guard')
export class UserGuardTest extends BaseTest {
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
      expected: true,
    },
    'A valid token should return true',
  )
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
        super.get(UserGuard).getRequest(context)
      } catch (error) {
        expect(error).toEqual(new ForbiddenException())
      }
    } else {
      const request: any = super.get(UserGuard).getRequest(context)
      expect(request.context).not.toBeNull()
    }
  }
}
