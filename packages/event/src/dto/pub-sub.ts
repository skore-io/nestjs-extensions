import { IsString, IsNotEmpty, IsEnum } from 'class-validator'
import { PubSubTypeEnum, PubSubActionEnum } from '../enum/pub-sub'

export class PubSubAttributes {
  @IsString()
  @IsNotEmpty()
  gcp_events_project: string

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
