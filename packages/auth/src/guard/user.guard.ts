import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { plainToClass } from 'class-transformer'
import { User } from '../domain'
import { authorizationHeader, getRequestFromContext } from '../util'
import { WorkspaceClient } from '../client'

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly workspaceClient: WorkspaceClient,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = getRequestFromContext(context)

    const token = authorizationHeader(request.headers)

    if (!token) return false

    const roles = this.reflector.get<string[]>('roles', context.getHandler())

    try {
      const user = await this.authorizeToken(token, roles)
      request.user = user
      return true
    } catch (error) {
      console.error('Error in trying to activate user', error)
      return false
    }
  }

  async authorizeToken(token: string, roles: string[]): Promise<User> {
    const user = await this.workspaceClient.getUser(token)

    if (roles && !roles.includes(user.role))
      throw new ForbiddenException(
        'User does not have the role required to access this resource',
      )

    return plainToClass(User, user, { excludeExtraneousValues: true })
  }
}
