import { UserRole } from './../enum/user-role.enum'
import { UnauthorizedException, ForbiddenException, Injectable, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PassportStrategy } from '@nestjs/passport'
import jwt from 'jsonwebtoken'
import { Strategy } from 'passport-http-bearer'
import { WorkspaceClient } from '../client'
import { UserOrCompanyAlg } from '../enum'
import { UserOrCompany } from '../domain'

@Injectable()
export class AdminOrCompanyStrategy extends PassportStrategy(Strategy, 'admin-or-company') {
  private readonly logger: Logger = new Logger(AdminOrCompanyStrategy.name)

  constructor(
    private readonly workspaceClient: WorkspaceClient,
    private readonly reflector: Reflector,
  ) {
    super({ passReqToCallback: true })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validate(request: any, token: string): Promise<UserOrCompany> {
    try {
      const decodedToken = jwt.decode(token, { complete: true })
      if (!decodedToken) {
        throw new UnauthorizedException('Token could not be decoded')
      }

      const alg = decodedToken.header.alg
      if (alg === UserOrCompanyAlg.USER) {
        const user = await this.workspaceClient.getUser(token)

        if (user.role !== UserRole.admin) {
          this.logger.error(`User does not have the role required to access this resource`)
          throw new ForbiddenException()
        }

        const current = {
          user,
          company: undefined,
        }
        request['current'] = current
        return current
      }

      const company = await this.workspaceClient.getCompany(token)
      if (!company) {
        this.logger.error(`Error in trying to authenticate company`)
        throw new ForbiddenException()
      }

      const current = {
        user: undefined,
        company,
      }
      request['current'] = current
      return current
    } catch (error) {
      this.logger.error(error.message)
      throw new ForbiddenException()
    }
  }
}
