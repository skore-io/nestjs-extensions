import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common'
import {
  DNSHealthIndicator,
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
} from '@nestjs/terminus'
import { readFileSync } from 'fs'
import { MongoIndicator, RedisIndicator } from '../indicator'

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly dns: DNSHealthIndicator,
    private readonly mongoIndicator: MongoIndicator,
    private readonly redisIndicator: RedisIndicator,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    Logger.log('Checking services health', HealthController.name)

    const { version } = JSON.parse(readFileSync('package.json', 'utf8'))

    try {
      const health = await this.health.check([
        (): Promise<HealthIndicatorResult> => this.mongoIndicator.statusCheck(),
        (): Promise<HealthIndicatorResult> => this.redisIndicator.statusCheck(),
      ])
      return { ...health, ...{ version } }
    } catch (error) {
      throw new ServiceUnavailableException({ ...error, ...{ version } })
    }
  }
}
