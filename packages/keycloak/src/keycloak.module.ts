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
  GetResourcePermissionsService,
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
    GetResourcePermissionsService,
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
    GetResourcePermissionsService,
    CheckResourcePermissionsService,
    CheckResourcePermissionsClient,
  ],
})
export class KeycloakModule {}
