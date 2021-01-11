import { HttpService, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { plainToClass } from 'class-transformer'
import { User } from '../domain'

@Injectable()
export class UserInfoClient {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async userInfo(realm: string, token: string): Promise<User> {
    try {
      const { data } = await this.httpService
        .get(
          `${this.configService.get(
            'KEYCLOAK_SERVER_URL',
          )}/auth/realms/${realm}/protocol/openid-connect/userinfo`,
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .toPromise()

      Logger.debug(`UserInfo ==== ${JSON.stringify(data)}`, UserInfoClient.name)

      return plainToClass(User, data)
    } catch (error) {
      const errorDescription = error.response?.data?.error_description || error

      Logger.error('Error on getting access token', errorDescription, UserInfoClient.name)

      throw Error(error.response.data.error_description)
    }
  }
}
