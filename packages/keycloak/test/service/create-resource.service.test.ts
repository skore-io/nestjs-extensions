import { suite, test } from '@testdeck/jest'
import { CreateResourceService } from '../../src/service'
import { BaseTest } from '../base-test'
import * as faker from 'faker'
import { Resource } from '../../src/domain'

@suite('[Keycloak Module] Create Resource Service')
export class CreateResourceServiceTest extends BaseTest {
  @test()
  async 'Given a valid resource then create'() {
    const service = super.get(CreateResourceService)
    const resource = {
      name: faker.name.title(),
      displayName: faker.random.word(),
      attributes: { key: 'value' },
    }

    const response = await service.perform('skore', resource)

    expect(response.id).toBeDefined()
    expect(response.scopes).toEqual(Resource.DEFAULT_SCOPES)
  }

  @test()
  async 'Given an invalid resource then throw error'() {
    const service = super.get(CreateResourceService)

    try {
      await service.perform('skore', { name: null, displayName: faker.random.word() })
    } catch (error) {
      expect(error.message).toEqual('Name or displayName is missing')
    }
  }
}
