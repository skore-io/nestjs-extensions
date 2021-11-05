import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { OAuth2Client } from 'google-auth-library'
import { User } from './domain'
import { ClientGuard, CompanyGuard, UserGuard } from './guard'
import { RestTemplate } from './template'
import { WorkspaceClient } from '../src/client'

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [
    WorkspaceClient,
    RestTemplate,
    ClientGuard,
    UserGuard,
    CompanyGuard,
    User,
    {
      provide: OAuth2Client,
      useFactory: () => new OAuth2Client(),
    },
  ],
  exports: [
    ClientGuard,
    CompanyGuard,
    UserGuard,
    OAuth2Client,
    RestTemplate,
    User,
  ],
})
export class SecurityModule {}
