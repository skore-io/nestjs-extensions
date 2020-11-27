import { Expose, Transform } from 'class-transformer'

export class Resource {
  constructor(name: string, displayName: string) {
    this.name = name
    this.displayName = displayName
  }

  @Expose()
  id: string

  @Expose()
  name: string

  @Expose({ name: 'display_name' })
  displayName: string

  @Expose()
  type?: string

  @Expose()
  @Transform(value => value || {})
  attributes?: unknown = {}

  @Transform(value => value || [])
  @Expose()
  scopes?: [{ id: string; name: string }]
}
