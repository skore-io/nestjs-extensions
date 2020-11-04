import { Module, HttpModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { KeycloakClient } from './client'
import { GetAccessTokenService, ValidateAccessTokenService } from './service'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  providers: [KeycloakClient, ValidateAccessTokenService, GetAccessTokenService],
})
export class KeycloakModule {}
