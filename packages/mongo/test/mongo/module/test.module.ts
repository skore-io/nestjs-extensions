import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongoModule } from '../../../src'

@Global()
@Module({
  imports: [
    MongoModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  exports: [MongoModule],
})
export class TestModule {}
