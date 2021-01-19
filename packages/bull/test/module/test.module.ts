import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { BullModule } from '../../src'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot(
      {
        useFactory: (configService: ConfigService) => ({
          redis: configService.get('REDIS_CONNECTION'),
        }),
        inject: [ConfigService],
      },
      { name: 'test' },
    ),
  ],
})
export class TestModule {}
