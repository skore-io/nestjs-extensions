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

  id?: string
  name: string
  resourceId: string
  scopes: ScopeType[]
  user?: string
  group?: string
}
