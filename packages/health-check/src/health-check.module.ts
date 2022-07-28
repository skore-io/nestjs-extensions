import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TerminusModule } from '@nestjs/terminus'
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis'
import { HealthController } from './controller'
import { DependenciesIndicator, MongoIndicator, RedisIndicator } from './indicator'

@Module({
  imports: [
    TerminusModule,
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService): RedisModuleOptions => ({
        config: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [HealthController],
  providers: [DependenciesIndicator, MongoIndicator, RedisIndicator],
})
export class HealthCheckModule {}
