import { Injectable, Optional } from '@nestjs/common'
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus'
import { readFileSync } from 'fs'

@Injectable()
export class DependenciesIndicator extends HealthIndicator {
  constructor(@Optional() private readonly filename: string = 'package.json') {
    super()
  }

  async statusCheck(): Promise<HealthIndicatorResult> {
    const pkg = JSON.parse(readFileSync(this.filename, 'utf8'))

    const isScoped = this.isScoped(pkg.name)

    if (isScoped) {
      const packageScope = this.scope(pkg.name)

      const scopedPackages = Object.entries(pkg.dependencies)
        .filter((dependency) => this.isScoped(dependency[0]))
        .filter((dependency) => this.scope(dependency[0]) === packageScope)
        .map((dependency) => ({ [dependency[0]]: dependency[1] }))

      pkg.scopedPackages = scopedPackages
    }

    return this.getStatus('dependencies', true, {
      version: pkg.version,
      deps: pkg.scopedPackages || [],
    })
  }

  private isScoped(packageName: string): boolean {
    return packageName.split('/').length > 1
  }

  private scope(packageName: string): string {
    return packageName.split('/')[0]
  }
}
