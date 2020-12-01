import { suite, test } from '@testdeck/jest'
import { plainToClass } from 'class-transformer'
import * as faker from 'faker'
import { CreateResourceService, Resource } from '../../src'
import { DeleteResourceService } from '../../src/service'
import { BaseTest } from '..//base-test'

@suite('Delete Resource Service')
export class DeleteResourceServiceTest extends BaseTest {
  @test()
  async 'Given a valid resource then delete'() {
    const resource = await this.createResource()
    const service = super.get(DeleteResourceService)
    const response = await service.perform('skore', resource.id)

    expect(response).toBeUndefined()
  }

  @test()
  async 'Given a not found resource then throw error'() {
    const service = super.get(DeleteResourceService)

    try {
      await service.perform('skore', 'not_found')
    } catch (error) {
      expect(error.message).toEqual('Request failed with status code 404')
    }
  }

  async createResource(scopes = []): Promise<Resource> {
    const service = super.get(CreateResourceService)

    return service.perform(
      'skore',
      plainToClass(Resource, {
        name: faker.name.title(),
        display_name: faker.random.word(),
        scopes,
      }),
    )
  }
}
