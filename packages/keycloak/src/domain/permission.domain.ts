import { Expose } from 'class-transformer'
import { ScopeType } from './scope-type.domain'

export class Permission {
  constructor(
    name: string,
    resourceId: string,
    scopes: ScopeType[],
    user?: string,
    group?: string,
  ) {
    this.name = name
    this.user = user
    this.group = group
    this.resourceId = resourceId
    this.scopes = scopes
  }

  @Expose()
  id?: string

  @Expose()
  name: string

  @Expose({ name: 'resource_id' })
  resourceId: string

  @Expose()
  scopes: ScopeType[]

  @Expose()
  user?: string

  @Expose()
  group?: string
}
