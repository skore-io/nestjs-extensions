import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { plainToClass } from 'class-transformer'
import { lastValueFrom } from 'rxjs'
import { Company, User } from '../domain'

@Injectable()
export class WorkspaceClient {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getUser(token: string): Promise<User> {
    const environment = this.configService.get('NODE_ENV')
    console.log(environment)

    const request = this.httpService.get(
      `${this.configService.get('WORKSPACE_URL')}/workspace/v1/users/current`,
      {
        headers: { Authorization: token },
      },
    )

    const { data } = await lastValueFrom(request)

    return plainToClass(User, data)
  }

  async getCompany(token: string): Promise<Company> {
    const request = this.httpService.get(
      `${this.configService.get('WORKSPACE_URL')}/api/v1/companies/current`,
      {
        headers: { Authorization: token },
      },
    )

    const { data } = await lastValueFrom(request)

    return plainToClass(Company, data)
  }
}
