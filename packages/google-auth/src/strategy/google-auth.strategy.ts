import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { OAuth2Client } from 'google-auth-library'
import { Strategy } from 'passport-http-bearer'

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'GoogleAuth') {
  constructor(
    private readonly oauth2Client: OAuth2Client,
    private readonly configService: ConfigService,
  ) {
    super({ passReqToCallback: true })
  }

  async validate(_: unknown, token: string): Promise<boolean> {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({ idToken: token })

      return this.configService
        .get('GOOGLE_AUTH_AUDIENCE')
        .split(',')
        .some(
          (aud: string) => ticket.getPayload().email_verified && ticket.getPayload().email === aud,
        )
    } catch (_) {
      throw new UnauthorizedException()
    }
  }
}
