import { Controller, Get } from '@nestjs/common'
import { HealthCheckResult, HealthCheckService } from '@nestjs/terminus'

@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthCheckService) {}

  @Get()
  check(): Promise<HealthCheckResult> {
    this.health.check([])
    return Promise.resolve(null)
  }
}
