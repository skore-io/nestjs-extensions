import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { User } from './domain'
import { CompanyGuard, UserGuard } from './guard'
import { WorkspaceClient } from './client'
import { UserStrategy, CompanyStrategy } from './strategy'

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [WorkspaceClient, UserGuard, CompanyGuard, User, CompanyStrategy, UserStrategy],
  exports: [CompanyGuard, UserGuard, User],
})
export class AuthModule {}
