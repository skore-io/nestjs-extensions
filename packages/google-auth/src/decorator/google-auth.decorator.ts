import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * Validate JWT token issued by google against a list of oauth audiences
 * defined by `GOOGLE_AUTH_AUDIENCE` environment variable.
 *
 * Header is extracted as http bearer.
 */
export const GoogleAuth = (): MethodDecorator => UseGuards(AuthGuard('GoogleAuth'))
