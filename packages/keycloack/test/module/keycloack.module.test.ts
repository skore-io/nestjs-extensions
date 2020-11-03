import { suite, test } from '@testdeck/jest'
import { KeycloackModule } from '../../src'

@suite('Keycloak Module')
export class KeycloackModuleTest {
  @test()
  'is defined'() {
    expect(KeycloackModule).toBeDefined()
  }
}
