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
  GetResourcePermissionsClient,
} from './client'
import {
  CreateResourceService,
  DeleteResourceService,
  FindUserService,
  LoginService,
  LogoutService,
  RefreshTokenService,
  FindResourceService,
  GetPermissionsService,
} from './service'
import { KeycloakStrategy } from './strategy'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  exports: [
    LoginService,
    LogoutService,
    RefreshTokenService,
    CreateResourceService,
    DeleteResourceClient,
    GetPermissionsService,
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
    GetResourcePermissionsClient,
    GetClientToken,
    LoginService,
    LogoutService,
    RefreshTokenService,
    FindUserService,
    CreateResourceService,
    DeleteResourceService,
    FindResourceService,
    GetPermissionsService,
  ],
})
export class KeycloakModule {}
