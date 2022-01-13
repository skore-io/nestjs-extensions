import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { User } from './domain'
import { CompanyGuard, UserGuard, AdminOrCompanyGuard } from './guard'
import { WorkspaceClient } from './client'
import { UserStrategy, CompanyStrategy, AdminOrCompanyStrategy } from './strategy'

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [
    WorkspaceClient,
    UserGuard,
    CompanyGuard,
    AdminOrCompanyGuard,
    User,
    CompanyStrategy,
    UserStrategy,
    AdminOrCompanyStrategy,
  ],
  exports: [CompanyGuard, UserGuard, AdminOrCompanyGuard, User],
})
export class AuthModule {}
