import { HttpModule, Module } from '@nestjs/common'
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
} from './client'
import {
  CheckResourcePermissionService,
  CreatePermissionService,
  CreateResourceService,
  DeleteResourceService,
  FindResourceService,
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
    UpdatePermissionClient,
  ],
})
export class KeycloakModule {}
