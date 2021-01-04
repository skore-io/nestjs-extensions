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
} from './client'
import {
  CheckResourcePermissionService,
  CreateResourceService,
  DeleteResourceService,
  FindResourceService,
  FindUserService,
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
  ],
  providers: [
    KeycloakStrategy,
    UserInfoClient,
    CreateResourceClient,
    DeleteResourceClient,
    UpdateResourceClient,
    FindResourceClient,
    GetResourcePermissionsClient,
    GetClientToken,
    FindUserService,
    CreateResourceService,
    DeleteResourceService,
    UpdateResourceService,
    FindResourceService,
    GetResourcePermissionsService,
    CheckResourcePermissionService,
    CheckResourcePermissionClient,
  ],
})
export class KeycloakModule {}
