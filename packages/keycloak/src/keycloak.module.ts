import { HttpModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoginClient, LogoutClient, UserInfoClient } from './client'
import { FindUserService, LoginService, LogoutService } from './service'
import { KeycloakStrategy } from './strategy'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  exports: [LoginService, LogoutService],
  providers: [
    UserInfoClient,
    LoginClient,
    LogoutClient,
    LoginService,
    LogoutService,
    KeycloakStrategy,
    FindUserService,
  ],
})
export class KeycloakModule {}
