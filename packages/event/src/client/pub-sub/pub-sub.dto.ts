import { Expose } from 'class-transformer'
import { AttributesActionEnum, AttributesTypeEnum } from '../../..'

export class AttributesPubSubDto {
  @Expose()
  gcp_events_project
  @Expose()
  type: AttributesTypeEnum
  @Expose()
  action: AttributesActionEnum
  @Expose()
  source: string
  @Expose()
  created_at: number
}
