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
  GetResourcePermissionsClient,
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
    UpdateResourceService,
    DeleteResourceService,
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
    UpdateResourceClient,
    FindResourceClient,
    GetResourcePermissionsClient,
    GetClientToken,
    LoginService,
    LogoutService,
    RefreshTokenService,
    FindUserService,
    CreateResourceService,
    DeleteResourceService,
    UpdateResourceService,
    FindResourceService,
    GetPermissionsService,
  ],
})
export class KeycloakModule {}
