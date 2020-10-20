import { Module } from '@nestjs/common'
import { MongoIndicator } from './indicator'

@Module({ providers: [MongoIndicator] })
export class HealthCheckModule {}
