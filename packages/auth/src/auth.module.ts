import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { User } from './domain'
import { CompanyGuard, UserGuard, UserOrCompanyGuard } from './guard'
import { WorkspaceClient } from './client'
import { UserStrategy, CompanyStrategy, UserOrCompanyStrategy } from './strategy'

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [
    WorkspaceClient,
    UserGuard,
    CompanyGuard,
    UserOrCompanyGuard,
    User,
    CompanyStrategy,
    UserStrategy,
    UserOrCompanyStrategy,
  ],
  exports: [CompanyGuard, UserGuard, UserOrCompanyGuard, User],
})
export class AuthModule {}
