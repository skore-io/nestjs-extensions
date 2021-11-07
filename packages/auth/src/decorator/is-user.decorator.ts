import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { UserRole } from '../enum'
import { UserGuard } from '../guard'

export const IsUser = (roles?: UserRole[]): MethodDecorator & ClassDecorator => {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(UserGuard))
}
