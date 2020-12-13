import { suite, test } from '@testdeck/jest'
import { DeleteResourceService } from '../../src/service'
import { BaseTest } from '../base-test'
import { ResourceFactory } from '../factory'

@suite('Delete Resource Service')
export class DeleteResourceServiceTest extends BaseTest {
  @test()
  async 'Given a valid resource then delete'() {
    const resource = await new ResourceFactory().create()
    const service = super.get(DeleteResourceService)
    const response = await service.perform('skore', resource.name)

    expect(response).toBeUndefined()
  }

  @test()
  async 'Given a not found resource then throw error'() {
    const service = super.get(DeleteResourceService)

    try {
      await service.perform('skore', 'not_found')
    } catch (error) {
      expect(error.message).toEqual('Resource not found')
    }
  }
}
