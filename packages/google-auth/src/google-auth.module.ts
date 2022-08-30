import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { OAuth2Client } from 'google-auth-library'
import { GoogleAuthGuard } from './guard'
import { AuthedRequest } from './service'
import { GoogleAuthStrategy } from './strategy'
/**
 * Passport strategy for google tokens
 *
 * Verify tokens from http header bearer and validate payload
 * email against a list of expected emails from `GOOGLE_AUTH_AUDIENCE`
 * environment variable.
 *
 * Usage:
 *
 * ```ts
 * @Module({
 *   imports: [ConfigModule.forRoot({ isGlobal: true }) GoogleAuthModule],
 * })
 * class AppModule {}
 * ```
 *
 * **Note**: ConfigModule must be exported either by `isGlobal: true` or `exports: [ConfigModule]`
 */
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    AuthedRequest,
    GoogleAuthGuard,
    GoogleAuthStrategy,
    { provide: OAuth2Client, useValue: new OAuth2Client() },
  ],
  exports: [AuthedRequest, GoogleAuthGuard],
})
export class GoogleAuthModule {}
