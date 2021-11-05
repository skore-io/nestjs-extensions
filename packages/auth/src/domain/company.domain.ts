import { Expose } from 'class-transformer'

export class Company {
  @Expose()
  id!: string
}
