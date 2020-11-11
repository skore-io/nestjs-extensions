import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { BullModule } from '../../src'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), BullModule.forRoot({ name: 'test' })],
})
export class TestModule {}
