import { Module } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'
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
  providers: [GoogleAuthStrategy, { provide: OAuth2Client, useValue: new OAuth2Client() }],
})
export class GoogleAuthModule {}
