import { Expose } from 'class-transformer'

export class User {
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
