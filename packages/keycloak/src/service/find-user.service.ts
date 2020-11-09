import { Injectable } from '@nestjs/common'
import { UserInfoClient } from '../client'
import { User } from '../domain'

@Injectable()
export class FindUserService {
  constructor(private readonly userInfoClient: UserInfoClient) {}
  perform(realm: string, token: string): Promise<User> {
    return this.userInfoClient.userInfo(realm, token)
  }
}
