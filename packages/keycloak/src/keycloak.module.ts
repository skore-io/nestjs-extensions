import { HttpModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { KeycloakStrategy } from './strategy'
import {
  CreateResourceClient,
  LoginClient,
  LogoutClient,
  RefreshTokenClient,
  UserInfoClient,
  UpdateResourceClient,
  GetClientToken,
  FindResourceClient,
} from './client'
import {
  CreateResourceService,
  FindUserService,
  LoginService,
  LogoutService,
  RefreshTokenService,
  UpdateResourceService,
} from './service'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  exports: [
    LoginService,
    LogoutService,
    RefreshTokenService,
    CreateResourceService,
    UpdateResourceService,
  ],
  providers: [
    KeycloakStrategy,
    UserInfoClient,
    LoginClient,
    LogoutClient,
    RefreshTokenClient,
    CreateResourceClient,
    UpdateResourceClient,
    FindResourceClient,
    GetClientToken,
    LoginService,
    LogoutService,
    RefreshTokenService,
    FindUserService,
    CreateResourceService,
    UpdateResourceService,
  ],
})
export class KeycloakModule {}
