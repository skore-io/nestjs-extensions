import { Controller, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common'
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
} from '@nestjs/terminus'
import { DependenciesIndicator, MongoIndicator, RedisIndicator } from '../indicator'

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly mongoIndicator: MongoIndicator,
    private readonly redisIndicator: RedisIndicator,
    private readonly dependenciesIndicator: DependenciesIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @HttpCode(HttpStatus.OK)
  async check(): Promise<HealthCheckResult> {
    Logger.log('Checking services health', HealthController.name)

    return this.health.check([
      (): Promise<HealthIndicatorResult> => this.mongoIndicator.statusCheck(),
      (): Promise<HealthIndicatorResult> => this.redisIndicator.statusCheck(),
      (): Promise<HealthIndicatorResult> => this.dependenciesIndicator.statusCheck(),
    ])
  }
}
