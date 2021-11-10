import { ForbiddenException } from '@nestjs/common'
import { test, suite } from '@testdeck/jest'
import { WorkspaceClient } from '../../src/client'
import { CompanyStrategy } from '../../src/strategy'
import { BaseTest } from '../base-test'

@suite('[Auth] Company Strategy')
export class CompanyStrategyTest extends BaseTest {
  @test
  async 'Given a valid token, then return company'() {
    jest.spyOn(this.get(WorkspaceClient), 'getCompany').mockResolvedValue({ id: '1' })

    const companyStrategy = await super.get(CompanyStrategy).validate({}, 'SHOULD_ASSERT_OK')
    expect(companyStrategy.id).toEqual('1')
  }

  @test
  async 'Given an invalid token, then throw error'() {
    jest.spyOn(this.get(WorkspaceClient), 'getCompany').mockResolvedValue(null)

    try {
      await super.get(CompanyStrategy).validate({}, 'SHOULD_ASSERT_OK')
    } catch (error) {
      expect(error).toEqual(new ForbiddenException())
    }
  }
}
