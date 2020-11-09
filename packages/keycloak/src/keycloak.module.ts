import { HttpModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { KeycloakClient } from './client'
import { GetAccessTokenService } from './service'
import { KeycloakStrategy } from './strategy'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  exports: [GetAccessTokenService],
  providers: [KeycloakClient, GetAccessTokenService, KeycloakStrategy],
})
export class KeycloakModule {}
