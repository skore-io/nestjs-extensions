import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OAuth2Client } from 'google-auth-library'
import { authorizationHeader, getRequestFromContext } from '../util'

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(
    private readonly authClient: OAuth2Client,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = getRequestFromContext(context)

    const token = authorizationHeader(request.headers)
    if (!token) return false

    try {
      const response = await this.authorizeToken(token)
      request.user = response
      return true
    } catch {
      return false
    }
  }

  async authorizeToken(token: string) {
    const ticket = await this.authClient.verifyIdToken({
      idToken: token,
      audience: this.configService.get('OAUTH_AUDIENCE'),
    })

    const payload = ticket.getPayload()
    console.log(payload)

    if (!payload.email_verified || !this.projectAllowed(payload.email)) {
      console.error('Service account %o not allowed', payload)
      throw new UnauthorizedException()
    }

    return payload
  }

  private projectAllowed(email: string) {
    const [projectId] = email.split('@')

    const allowedProjects = this.configService
      .get('OAUTH_ALLOWED_PROJECTS', '')
      .split(',')

    return allowedProjects.some(allowedProject => allowedProject === projectId)
  }
}
