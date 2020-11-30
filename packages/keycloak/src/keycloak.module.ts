import { HttpModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { KeycloakStrategy } from './strategy'
import {
  CreateResourceClient,
  LoginClient,
  LogoutClient,
  RefreshTokenClient,
  UserInfoClient,
  GetClientToken,
} from './client'
import {
  CreateResourceService,
  FindUserService,
  LoginService,
  LogoutService,
  RefreshTokenService,
} from './service'

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
    CreateResourceService,
    GetClientToken,
  ],
})
export class KeycloakModule {}
