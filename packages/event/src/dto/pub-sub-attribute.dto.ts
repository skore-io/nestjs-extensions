import { IsNotEmpty, IsEnum } from 'class-validator'
import { PubSubTypeEnum, PubSubActionEnum } from '../enum'

export class PubSubAttributeDto {
  @IsNotEmpty()
  @IsEnum(PubSubTypeEnum)
  type: PubSubTypeEnum

  @IsNotEmpty()
  @IsEnum(PubSubActionEnum)
  action: PubSubActionEnum

  @IsNotEmpty()
  source: string

  constructor(props) {
    Object.assign(this, props)
  }
}
