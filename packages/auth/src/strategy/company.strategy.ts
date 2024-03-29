import { ForbiddenException, Injectable, Logger } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-http-bearer'
import { WorkspaceClient } from '../client'
import { Company } from '../domain'

@Injectable()
export class CompanyStrategy extends PassportStrategy(Strategy, 'company') {
  private readonly logger: Logger = new Logger(CompanyStrategy.name)

  constructor(private readonly workspaceClient: WorkspaceClient) {
    super({ passReqToCallback: true })
  }

  async validate(request: unknown, token: string): Promise<Company> {
    try {
      const company = await this.workspaceClient.getCompany(token)

      if (!company) throw Error('Unauthorized company token')

      request['company'] = company

      return company
    } catch (error) {
      this.logger.error(`Error in trying to authenticate company: ${error}`)
      throw new ForbiddenException()
    }
  }
}
