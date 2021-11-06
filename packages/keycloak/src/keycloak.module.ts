import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import {
  CheckResourcePermissionClient,
  CreatePermissionClient,
  CreateResourceClient,
  DeleteResourceClient,
  FindResourceClient,
  GetClientToken,
  GetResourcePermissionsClient,
  UpdateResourceClient,
  UserInfoClient,
  FindUserClient,
  UpdatePermissionClient,
  FindResourcePermissionsClient,
} from './client'
import {
  CheckResourcePermissionService,
  CreatePermissionService,
  CreateResourceService,
  DeleteResourceService,
  FindResourceService,
  FindResourcePermissionsService,
  FindUserService,
  FindUserByIdService,
  GetResourcePermissionsService,
  UpdateResourceService,
  UpdatePermissionService,
} from './service'
import { KeycloakStrategy } from './strategy'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  exports: [
    CreateResourceService,
    UpdateResourceService,
    DeleteResourceService,
    GetResourcePermissionsService,
    CheckResourcePermissionService,
    CreatePermissionService,
    UpdatePermissionService,
    FindResourcePermissionsService,
    FindUserByIdService,
  ],
  providers: [
    KeycloakStrategy,
    UserInfoClient,
    CreateResourceClient,
    DeleteResourceClient,
    UpdateResourceClient,
    FindResourceClient,
    GetResourcePermissionsClient,
    FindUserClient,
    CheckResourcePermissionClient,
    CreatePermissionClient,
    UpdatePermissionClient,
    FindResourcePermissionsClient,
    GetClientToken,
    FindUserService,
    FindUserByIdService,
    CreateResourceService,
    DeleteResourceService,
    UpdateResourceService,
    FindResourceService,
    GetResourcePermissionsService,
    CheckResourcePermissionService,
    CreatePermissionService,
    UpdatePermissionService,
    FindResourcePermissionsService,
  ],
})
export class KeycloakModule {}
