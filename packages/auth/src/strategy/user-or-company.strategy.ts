import { ForbiddenException, Injectable, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-http-bearer'
import { WorkspaceClient } from '../client'
import { User, Company } from '../domain'

@Injectable()
export class UserOrCompanyStrategy extends PassportStrategy(Strategy, 'user-or-company') {
  private readonly logger: Logger = new Logger(UserOrCompanyStrategy.name)

  constructor(
    private readonly workspaceClient: WorkspaceClient,
    private readonly reflector: Reflector,
  ) {
    super({ passReqToCallback: true })
  }

  async validate(request, token: string): Promise<User | Company> {
    try {
      const company = await this.workspaceClient.getCompany(token)
      if (!company) throw Error('Unauthorized company token')

      request['company'] = company

      return company
    } catch (error) {
      const roles = this.reflector.get<string[]>('roles', request.context.getHandler())
      const user = await this.workspaceClient.getUser(token)

      if (roles && !roles.includes(user.role)) {
        this.logger.error(`User does not have the role required to access this resource`)
        throw new ForbiddenException()
      }

      return user
    }
  }
}
