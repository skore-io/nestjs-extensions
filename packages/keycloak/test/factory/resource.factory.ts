import * as faker from 'faker'
import { Test } from '@nestjs/testing'
import { plainToClass } from 'class-transformer'
import { KeycloakModule } from '../../src/keycloak.module'
import { Resource } from '../../src/domain'
import { CreateResourceService } from '../../src/service'

export class ResourceFactory {
  async create(scopes = []): Promise<Resource> {
    const app = await this.createNestApplication()
    const service = app.get(CreateResourceService)

    return service.perform(
      'skore',
      plainToClass(Resource, {
        name: faker.name.title(),
        display_name: faker.random.word(),
        scopes,
      }),
    )
  }

  private async createNestApplication() {
    const moduleRef = await Test.createTestingModule({
      imports: [KeycloakModule],
    }).compile()

    return moduleRef.createNestApplication().init()
  }
}
