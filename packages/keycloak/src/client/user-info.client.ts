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
      return plainToClass(User, data, { excludeExtraneousValues: true })
    } catch (error) {
      Logger.error(
        `Error on getting access token ${error}, ${error.response.data.error_description}`,
        UserInfoClient.name,
      )

      throw Error(error.response.data.error_description)
    }
  }
}
