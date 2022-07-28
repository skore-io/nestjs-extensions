import { Injectable } from '@nestjs/common'
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus'
import { RedisService } from '@liaoliaots/nestjs-redis'

@Injectable()
export class RedisIndicator extends HealthIndicator {
  constructor(private readonly redisService: RedisService) {
    super()
  }

  async statusCheck(): Promise<HealthIndicatorResult> {
    try {
      const redisInfo = await this.redisService.getClient().info()

      return this.getStatus('redis', !!redisInfo)
    } catch (error) {
      throw new HealthCheckError('Check redis failed', error)
    }
  }
}
