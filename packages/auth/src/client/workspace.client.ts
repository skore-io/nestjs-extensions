import { HttpService } from '@nestjs/axios'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { Company, User } from '../domain'

@Injectable()
export class WorkspaceClient {
  private readonly authBaseUrl: string

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.authBaseUrl = this.configService.get('AUTH_BASE_URL')
  }

  async getUser(token: string): Promise<User> {
    const request = this.httpService.get(`${this.authBaseUrl}/workspace/v1/users/current`, {
      headers: { Authorization: token },
    })

    const { data } = await lastValueFrom(request)

    return User.toInstance(data)
  }

  async getCompany(token: string): Promise<Company> {
    const request = this.httpService.get(`${this.authBaseUrl}/workspace/v1/companies/current`, {
      headers: { Authorization: token },
    })

    const { data } = await lastValueFrom(request)

    if (data.token_type !== 'company') throw new ForbiddenException()

    return Company.toInstance({ ...data, id: String(data.company_id) })
  }
}
