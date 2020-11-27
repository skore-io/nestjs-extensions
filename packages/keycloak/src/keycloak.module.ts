import { HttpModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import {
  CreateResourceClient,
  LoginClient,
  LogoutClient,
  RefreshTokenClient,
  UserInfoClient,
} from './client'
import { FindUserService, LoginService, LogoutService, RefreshTokenService } from './service'
import { KeycloakStrategy } from './strategy'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  exports: [LoginService, LogoutService, RefreshTokenService],
  providers: [
    KeycloakStrategy,
    UserInfoClient,
    LoginClient,
    LogoutClient,
    RefreshTokenClient,
    CreateResourceClient,
    LoginService,
    LogoutService,
    RefreshTokenService,
    FindUserService,
  ],
})
export class KeycloakModule {}
