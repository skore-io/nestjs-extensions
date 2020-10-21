import { suite, test } from '@testdeck/jest'

@suite('simple ')
export class FalseTest {
  @test
  'Given some'() {
    return expect(true).toBeFalsy()
  }
}
