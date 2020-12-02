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
  UpdateResourceClient,
  FindResourceClient,
} from './client'
import {
  CreateResourceService,
  DeleteResourceService,
  FindUserService,
  LoginService,
  LogoutService,
  RefreshTokenService,
  UpdateResourceService,
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
    UpdateResourceService,
    DeleteResourceClient,
  ],
  providers: [
    KeycloakStrategy,
    UserInfoClient,
    LoginClient,
    LogoutClient,
    RefreshTokenClient,
    CreateResourceClient,
    DeleteResourceClient,
    UpdateResourceClient,
    FindResourceClient,
    GetClientToken,
    LoginService,
    LogoutService,
    RefreshTokenService,
    FindUserService,
    CreateResourceService,
    DeleteResourceService,
    UpdateResourceService,
    FindResourceService,
  ],
})
export class KeycloakModule {}
