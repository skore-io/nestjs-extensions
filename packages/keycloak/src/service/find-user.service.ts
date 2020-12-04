import { Injectable } from '@nestjs/common'
import { UserInfoClient } from '../client'
import { User } from '../domain'

@Injectable()
export class FindUserService {
  constructor(private readonly userInfoClient: UserInfoClient) {}
  async perform(realm: string, token: string): Promise<User> {
    const user = await this.userInfoClient.userInfo(realm, token)
    user.jwtToken = token
    return user
  }
}
