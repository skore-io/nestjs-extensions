import { HttpModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import {
  CreateResourceClient,
  DeleteResourceClient,
  GetClientToken,
  LoginClient,
  LogoutClient,
  RefreshTokenClient,
  UserInfoClient,
  FindResourceClient,
} from './client'
import {
  CreateResourceService,
  DeleteResourceService,
  FindUserService,
  LoginService,
  LogoutService,
  RefreshTokenService,
  FindResourceService,
} from './service'
import { KeycloakStrategy } from './strategy'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  exports: [
    LoginService,
    LogoutService,
    RefreshTokenService,
    CreateResourceService,
    DeleteResourceService,
  ],
  providers: [
    KeycloakStrategy,
    UserInfoClient,
    LoginClient,
    LogoutClient,
    RefreshTokenClient,
    CreateResourceClient,
    DeleteResourceClient,
    FindResourceClient,
    LoginService,
    LogoutService,
    RefreshTokenService,
    FindUserService,
    CreateResourceService,
    GetClientToken,
    DeleteResourceService,
    FindResourceService,
  ],
})
export class KeycloakModule {}
