import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { KeycloakClient } from './client'
import { ValidateAccessTokenService } from './service'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [KeycloakClient, ValidateAccessTokenService],
})
export class KeycloakModule {}
