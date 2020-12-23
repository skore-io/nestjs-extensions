import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TerminusModule } from '@nestjs/terminus'
import { RedisModule } from 'nestjs-redis'
import { HealthController } from './controller'
import { DependenciesIndicator, MongoIndicator, RedisIndicator } from './indicator'

@Module({
  imports: [
    TerminusModule,
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        url: configService.get('REDIS_CONNECTION'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [HealthController],
  providers: [DependenciesIndicator, MongoIndicator, RedisIndicator],
})
export class HealthCheckModule {}
