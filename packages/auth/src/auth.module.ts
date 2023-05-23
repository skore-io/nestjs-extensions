import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { User } from './domain'
import { CompanyGuard, UserGuard, AdminOrCompanyGuard, ServiceGuard } from './guard'
import { WorkspaceClient, KeycloakClient } from './client'
import { UserStrategy, CompanyStrategy, AdminOrCompanyStrategy } from './strategy'
import { AuthedRequest } from './service'
import { ServiceStrategy } from './strategy/service.strategy'

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [
    KeycloakClient,
    WorkspaceClient,
    UserGuard,
    CompanyGuard,
    ServiceGuard,
    AdminOrCompanyGuard,
    User,
    CompanyStrategy,
    UserStrategy,
    AdminOrCompanyStrategy,
    AuthedRequest,
    ServiceStrategy,
  ],
  exports: [AuthedRequest, CompanyGuard, UserGuard, AdminOrCompanyGuard, User],
})
export class AuthModule {}
