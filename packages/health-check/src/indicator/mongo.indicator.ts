import { Injectable } from '@nestjs/common'
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus'
import { Db } from 'mongodb'

@Injectable()
export class MongoIndicator extends HealthIndicator {
  constructor(private readonly db: Db) {
    super()
  }

  async pingCheck(): Promise<HealthIndicatorResult> {
    try {
      const stats = await this.db.stats()
      return this.getStatus('mongodb', stats.ok)
    } catch (error) {
      throw new HealthCheckError('MongoDB check status failed', error)
    }
  }
}
