import { Expose } from 'class-transformer'
import { TransformerUtil } from '../util'

export class Company extends TransformerUtil {
  @Expose()
  id!: string
}
