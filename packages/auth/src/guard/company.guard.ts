import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { WorkspaceClient } from '../client'
import { authorizationHeader, getRequestFromContext } from '../util'

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private readonly workspaceClient: WorkspaceClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = getRequestFromContext(context)

    const token = authorizationHeader(request.headers)
    if (!token) return false

    try {
      const company = await this.workspaceClient.getCompany(token)
      if (!company) return false

      request.company = company
      return true
    } catch (error) {
      console.error('Error in trying to activate company', error)
      return false
    }
  }
}
