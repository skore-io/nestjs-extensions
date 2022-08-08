import { IsNotEmpty, IsEnum } from 'class-validator'
import { PubSubTypeEventEnum, PubSubActionEnum } from '../enum'

export class PubSubAttributeDto {
  @IsNotEmpty()
  @IsEnum(PubSubTypeEventEnum)
  type: PubSubTypeEventEnum

  @IsNotEmpty()
  @IsEnum(PubSubActionEnum)
  action: PubSubActionEnum

  @IsNotEmpty()
  source: string

  constructor(props) {
    Object.assign(this, props)
  }
}
