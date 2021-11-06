import { Expose, Transform } from 'class-transformer'
import { ScopeType } from './scope-type.domain'

export class Resource {
  static readonly DEFAULT_SCOPES = Object.values(ScopeType).map(scopeType => ({ name: scopeType }))

  constructor(name: string, displayName: string) {
    this.name = name
    this.displayName = displayName
  }

  @Expose()
  id?: string

  @Expose()
  name: string

  @Expose({ name: 'display_name' })
  displayName: string

  @Expose()
  @Transform(({ value }) => value || {})
  attributes?: unknown = {}

  @Transform(({ value }) => value || Resource.DEFAULT_SCOPES)
  @Expose()
  scopes?: { name: ScopeType }[] = Resource.DEFAULT_SCOPES
}
