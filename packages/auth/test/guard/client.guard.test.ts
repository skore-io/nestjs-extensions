import { ExecutionContext, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { suite, test, params } from '@testdeck/jest'
import { NestHelper } from '../nest.helper'
import { ClientGuard } from '../../src/guard'

@suite('[Guard] Client Guard Test')
export class ClientGuardTest extends NestHelper{
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
      authorization: 'Bearer invalid',
      expected: false,
    },
    'A invalid token should return false',
  )
  @params(
    {
      authorization: 'Bearer VALID_PROJECT',
      expected: true,
    },
    'A valid token should return true',
  )
  async testClientGuardToken({authorization, expected}) {
    const clientGuard = this.get(ClientGuard)

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

    jest.spyOn(this.get(ConfigService), 'get').mockReturnValue('project1,project2')

    const clientCanActivate = await clientGuard.canActivate(context)

    expect(clientCanActivate).toBe(expected)
  }

  @test
  async 'Given unlisted project, should return false'() {
    const clientGuard = this.get(ClientGuard)

    const context = ({
      getArgByIndex: () => [],
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer VALID_PROJECT',
          },
        }),
      }),
      getHandler: () => [],
    } as unknown) as ExecutionContext

    jest.spyOn(this.get(ConfigService), 'get').mockReturnValue('project3,project4')

    const clientCanActivate = await clientGuard.canActivate(context)

    expect(clientCanActivate).toBe(false)
  }
}
