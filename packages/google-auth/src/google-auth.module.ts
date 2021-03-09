import { Module } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'
import { GoogleAuthStrategy } from './strategy'

@Module({
  providers: [GoogleAuthStrategy, { provide: OAuth2Client, useValue: new OAuth2Client() }],
})
export class GoogleAuthModule {}
