import { IsNotEmpty, IsEnum } from 'class-validator'
import {
  PubSubTypeEventEnum,
  PubSubTypeCommandEnum,
  PubSubTypeMessageEnum,
  PubSubActionEnum,
} from '../enum'

export class PubSubAttributeDto {
  @IsNotEmpty()
  @IsEnum({ ...PubSubTypeEventEnum, ...PubSubTypeCommandEnum, ...PubSubTypeMessageEnum })
  type: PubSubTypeEventEnum | PubSubTypeCommandEnum | PubSubTypeMessageEnum

  @IsNotEmpty()
  @IsEnum(PubSubActionEnum)
  action: PubSubActionEnum

  @IsNotEmpty()
  source: string

  constructor(props) {
    Object.assign(this, props)
  }
}
