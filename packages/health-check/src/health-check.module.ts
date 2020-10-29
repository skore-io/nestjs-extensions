import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TerminusModule } from '@nestjs/terminus'
import { RedisModule } from 'nestjs-redis'
import { HealthController } from './controller'
import { MongoIndicator, RedisIndicator } from './indicator'

@Module({
  imports: [
    TerminusModule,
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        host: configService.get('REDIS_URL'),
        port: configService.get('REDIS_PORT'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [HealthController],
  providers: [MongoIndicator, RedisIndicator],
})
export class HealthCheckModule {}
