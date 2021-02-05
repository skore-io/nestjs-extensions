import { Expose } from 'class-transformer'

export class User {
  constructor(username: string, name: string, email: string) {
    this.username = username
    this.name = name
    this.email = email
  }

  @Expose({ name: 'sub' })
  id: string

  @Expose()
  name: string

  @Expose()
  email: string

  @Expose()
  accessToken: string

  @Expose({ name: 'preferred_username' })
  username: string

  @Expose({ name: 'environment_id' })
  environmentId: string
}
