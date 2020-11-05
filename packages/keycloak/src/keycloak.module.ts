import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { KeycloakClient } from './client'
import { ValidateAccessTokenService } from './service'
import { KeycloakStrategy } from './strategy'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [KeycloakClient, ValidateAccessTokenService, KeycloakStrategy],
})
export class KeycloakModule {}
