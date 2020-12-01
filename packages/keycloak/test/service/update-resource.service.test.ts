import * as faker from 'faker'
import { suite, test } from '@testdeck/jest'
import { BaseTest } from '../base-test'
import { UpdateResourceService } from '../../src/service'
import { ResourceFactory } from '../factory'

@suite('[Keycloak Module] Update Resource Service')
export class UpdateResourceServiceTest extends BaseTest {
  @test()
  async 'Given a valid resource then update'() {
    const resource = await new ResourceFactory().create()
    const service = super.get(UpdateResourceService)

    const params = {
      name: faker.name.title(),
      displayName: faker.random.word(),
      attributes: { key: 'value' },
    }

    const response = await service.perform('skore', resource.name, params)

    expect(response).toBeUndefined()
  }

  @test()
  async 'Given a not found resource then throw error'() {
    const service = super.get(UpdateResourceService)

    try {
      await service.perform('skore', 'et bilu', { name: 'teste', displayName: 'teste' })
    } catch (error) {
      expect(error.message).toEqual('Resource not found')
    }
  }
}
