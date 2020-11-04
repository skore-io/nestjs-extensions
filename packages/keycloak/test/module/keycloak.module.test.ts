import { suite, test } from '@testdeck/jest'
import { KeycloakModule } from '../../src'
@suite('Keycloak Module')
export class KeycloakModuleTest {
  @test()
  'is defined'() {
    expect(KeycloakModule).toBeDefined()
  }
}
