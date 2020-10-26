import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RedisModule } from 'nestjs-redis'
import { MongoIndicator, RedisIndicator } from './indicator'

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        host: configService.get('REDIS_URL'),
        port: configService.get('REDIS_PORT'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MongoIndicator, RedisIndicator],
})
export class HealthCheckModule {}
