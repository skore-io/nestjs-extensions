import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { UserRole } from '../enum'
import { UserGuard } from '../guard'

export function IsUser(roles?: UserRole[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(UserGuard))
}
