import { Injectable } from '@nestjs/common'
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus'
import { Db } from 'mongodb'

@Injectable()
export class MongoIndicator extends HealthIndicator {
  constructor(private readonly db: Db) {
    super()
  }

  async pingCheck(): Promise<HealthIndicatorResult> {
    const stats = await this.db.stats()

    console.log(stats)
    return this.getStatus('mongodb', stats.ok)
  }
}
