import { HttpModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { KeycloakClient, UserInfoClient } from './client'
import { FindUserService, GetAccessTokenService } from './service'
import { KeycloakStrategy } from './strategy'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  exports: [GetAccessTokenService],
  providers: [
    KeycloakClient,
    UserInfoClient,
    GetAccessTokenService,
    KeycloakStrategy,
    FindUserService,
  ],
})
export class KeycloakModule {}
