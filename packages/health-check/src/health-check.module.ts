import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HealthController } from './controller'
import { DependenciesIndicator, MongoIndicator } from './indicator'

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [DependenciesIndicator, MongoIndicator],
})
export class HealthCheckModule {}
