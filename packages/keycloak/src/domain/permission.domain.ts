import { ScopeType } from './scope-type.domain'
import { ArrayNotEmpty, IsNotEmpty, ValidateIf, validateOrReject } from 'class-validator'

export class Permission {
  constructor(
    name: string,
    resourceId: string,
    scope: ScopeType,
    users?: string[],
    groups?: string[],
  ) {
    this.name = name
    this.users = users || []
    this.groups = groups || []
    this.resourceId = resourceId
    this.scope = scope
  }

  @IsNotEmpty({ groups: ['update'] })
  id?: string

  @IsNotEmpty({ groups: ['create', 'update'] })
  name: string

  @IsNotEmpty({ groups: ['create', 'update'] })
  resourceId: string

  @IsNotEmpty({ groups: ['create', 'update'] })
  scope: ScopeType

  @ValidateIf((self) => !self.groups.length, { groups: ['create'] })
  @ArrayNotEmpty({ message: 'Users or groups should not be empty', groups: ['create'] })
  users?: string[] = []

  groups?: string[] = []

  static async validate(permission: Permission, action: string): Promise<void> {
    await validateOrReject(permission, { groups: [action] })
  }
}
