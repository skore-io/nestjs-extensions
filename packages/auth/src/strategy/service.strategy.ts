import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-http-bearer'
import { KeycloakClient } from '../client'

@Injectable()
export class ServiceStrategy extends PassportStrategy(Strategy, 'service') {
  constructor(private readonly keycloakClient: KeycloakClient) {
    super({ passReqToCallback: true })
  }

  async validate(_: unknown, token: string): Promise<boolean> {
    const { active } = await this.keycloakClient.validateToken(token)

    if (!active) {
      throw new UnauthorizedException('Invalid token')
    }

    return true
  }
}
