import { HttpModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import {
  CheckResourcePermissionClient,
  CreateResourceClient,
  DeleteResourceClient,
  FindResourceClient,
  GetClientToken,
  GetResourcePermissionsClient,
  UpdateResourceClient,
  UserInfoClient,
  FindUserClient,
} from './client'
import {
  CheckResourcePermissionService,
  CreateResourceService,
  DeleteResourceService,
  FindResourceService,
  FindUserService,
  FindUserByIdService,
  GetResourcePermissionsService,
  UpdateResourceService,
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
    GetClientToken,
    FindUserService,
    FindUserByIdService,
    CreateResourceService,
    DeleteResourceService,
    UpdateResourceService,
    FindResourceService,
    GetResourcePermissionsService,
    CheckResourcePermissionService,
  ],
})
export class KeycloakModule {}
