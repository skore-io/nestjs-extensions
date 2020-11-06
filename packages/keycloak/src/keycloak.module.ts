import { Module, HttpModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { KeycloakClient } from './client'
import { GetAccessTokenService, ValidateAccessTokenService } from './service'
import { KeycloakStrategy } from './strategy'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  exports: [GetAccessTokenService],
  providers: [KeycloakClient, ValidateAccessTokenService, GetAccessTokenService, KeycloakStrategy],
})
export class KeycloakModule {}
