import { suite, test } from '@testdeck/jest'

@suite
export class DummyTest {
  @test
  async 'Dummy test'() {
    expect(true).toBeTruthy()
  }
}
