import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { KeycloakClient } from './client'
import { ValidateAccessToken } from './service'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [KeycloakClient, ValidateAccessToken],
})
export class KeycloackModule {}
