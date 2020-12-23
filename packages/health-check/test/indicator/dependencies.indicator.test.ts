import { suite, test } from '@testdeck/jest'
import { DependenciesIndicator } from '../../src/indicator'

@suite('Dependencies Indicator')
export class DependenciesIndicatorTest {
  @test
  async 'Given package without scoped dependencies then return no deps'() {
    const dependenciesIndicator = new DependenciesIndicator()

    const indicator = await dependenciesIndicator.statusCheck()

    expect(indicator.dependencies.version).toBeDefined()
    expect(indicator.dependencies.deps).toHaveLength(0)
  }

  @test
  async 'Given package with scoped dependencies then return deps'() {
    const dependenciesIndicator = new DependenciesIndicator('test/indicator/scope.package.json')

    const indicator = await dependenciesIndicator.statusCheck()

    expect(indicator.dependencies.version).toBeDefined()
    expect(indicator.dependencies.deps).toHaveLength(7)
  }
}
