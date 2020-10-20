import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus'
import { MongoClient } from 'mongodb'

@Injectable()
export class MongoIndicator extends HealthIndicator {
  constructor(private readonly configService: ConfigService) {
    super()
  }

  async pingCheck(): Promise<HealthIndicatorResult> {
    const mongoClient = await MongoClient.connect(this.configService.get('DATABASE_URL'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    const stats = await mongoClient.db('skore_dev').stats()

    return Promise.resolve(null)
  }
}
