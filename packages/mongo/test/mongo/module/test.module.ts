import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongoModule } from '../../../src'

@Global()
@Module({
  imports: [
    MongoModule.register({
      useFactory: (configService: ConfigService) => ({
        connection: configService.get('MONGO_CONNECTION_URI'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvVars: true,
    }),
  ],
  exports: [MongoModule],
})
export class TestModule {}
