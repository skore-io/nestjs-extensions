import { Expose } from 'class-transformer'
import { Company, User } from '.'

export class UserOrCompany {
  @Expose()
  user: User

  @Expose()
  company: Company
}
