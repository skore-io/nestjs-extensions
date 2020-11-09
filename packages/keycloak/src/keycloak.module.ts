import { Module, HttpModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { KeycloakClient, LoginClient, LogoutClient } from './client'
import { LoginService, LogoutService, ValidateAccessTokenService } from './service'
import { KeycloakStrategy } from './strategy'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  exports: [LoginService, LogoutClient],
  providers: [
    KeycloakClient,
    LoginClient,
    LogoutClient,
    ValidateAccessTokenService,
    LoginService,
    LogoutService,
    KeycloakStrategy,
  ],
})
export class KeycloakModule {}
