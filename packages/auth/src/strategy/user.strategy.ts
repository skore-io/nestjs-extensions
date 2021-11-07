import { ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { plainToClass } from 'class-transformer'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-http-bearer'
import { WorkspaceClient } from '../client'
import { User } from '../domain'

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user') {
  private readonly logger: Logger = new Logger(UserStrategy.name)

  constructor(
    private readonly workspaceClient: WorkspaceClient,
    private readonly reflector: Reflector,
  ) {
    super({ passReqToCallback: true })
  }

  async validate(request: { context: ExecutionContext }, token: string): Promise<User> {
    const roles = this.reflector.get<string[]>('roles', request.context.getHandler())

    try {
      const user = await this.workspaceClient.getUser(token)

      if (roles && !roles.includes(user.role)) {
        throw Error('User does not have the role required to access this resource')
      }

      return plainToClass(User, user, { excludeExtraneousValues: true })
    } catch (error) {
      this.logger.error(`Error in trying to activate user: ${error}`)
      throw new ForbiddenException()
    }
  }
}
