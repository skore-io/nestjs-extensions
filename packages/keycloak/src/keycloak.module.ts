import { HttpModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import {
  CheckResourcePermissionsClient,
  CreateResourceClient,
  DeleteResourceClient,
  FindResourceClient,
  GetClientToken,
  GetResourcePermissionsClient,
  LoginClient,
  LogoutClient,
  RefreshTokenClient,
  UpdateResourceClient,
  UserInfoClient,
} from './client'
import {
  CheckResourcePermissionsService,
  CreateResourceService,
  DeleteResourceService,
  FindResourceService,
  FindUserService,
  GetPermissionsService,
  LoginService,
  LogoutService,
  RefreshTokenService,
  UpdateResourceService,
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
    CheckResourcePermissionsService,
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
    CheckResourcePermissionsService,
    CheckResourcePermissionsClient,
  ],
})
export class KeycloakModule {}
