import { UnauthorizedException, ForbiddenException, Injectable, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PassportStrategy } from '@nestjs/passport'
import jwt from 'jsonwebtoken'
import { Strategy } from 'passport-http-bearer'
import { WorkspaceClient } from '../client'
import { User, Company } from '../domain'
import { UserOrCompanyAlg } from '../enum'

@Injectable()
export class AdminOrCompanyStrategy extends PassportStrategy(Strategy, 'admin-or-company') {
  private readonly logger: Logger = new Logger(AdminOrCompanyStrategy.name)

  constructor(
    private readonly workspaceClient: WorkspaceClient,
    private readonly reflector: Reflector,
  ) {
    super({ passReqToCallback: true })
  }

  async validate(request, token: string): Promise<User | Company> {
    const decodedToken = jwt.decode(token, { complete: true })
    if (!decodedToken) {
      throw new UnauthorizedException('Token could not be decoded')
    }

    const alg = decodedToken.header.alg
    if (alg === UserOrCompanyAlg.USER) {
      const roles = this.reflector.get<string[]>('roles', request.context.getHandler())
      const user = await this.workspaceClient.getUser(token)

      if (roles && !roles.includes(user.role)) {
        this.logger.error(`User does not have the role required to access this resource`)
        throw new ForbiddenException()
      }

      return user
    }

    const company = await this.workspaceClient.getCompany(token)
    if (!company) {
      this.logger.error(`Error in trying to authenticate company`)
      throw new ForbiddenException()
    }

    request['company'] = company
    return company
  }
}
