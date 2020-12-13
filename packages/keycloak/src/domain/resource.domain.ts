import { Expose, Transform } from 'class-transformer'

export class Resource {
  static readonly DEFAULT_SCOPES = [
    { name: 'create' },
    { name: 'update' },
    { name: 'delete' },
    { name: 'list' },
    { name: 'find' },
  ]

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
  @Transform(value => value || {})
  attributes?: unknown = {}

  @Transform(value => value || Resource.DEFAULT_SCOPES)
  @Expose()
  scopes?: { name: string }[] = Resource.DEFAULT_SCOPES
}
