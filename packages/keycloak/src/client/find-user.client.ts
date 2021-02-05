import { HttpService, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '../domain'

@Injectable()
export class FindUserClient {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async info(realm: string, clientToken: string, id: string): Promise<User> {
    try {
      const { data } = await this.httpService
        .get(
          `${this.configService.get('KEYCLOAK_SERVER_URL')}/auth/admin/realms/${realm}/users/${id}`,
          { headers: { Authorization: `Bearer ${clientToken}` } },
        )
        .toPromise()

      const name = `${data.firstName} ${data.lastName}`

      const user = new User(data.username, name, data.email)

      user.id = data.id

      return user
    } catch (error) {
      const errorDescription = error.response?.data?.error || error

      Logger.error('Error on finding user', errorDescription, FindUserClient.name)

      throw Error(errorDescription)
    }
  }
}
