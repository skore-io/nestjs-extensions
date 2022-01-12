import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { UserRole } from '../enum'
import { UserOrCompanyGuard } from '../guard'

export const IsUserOrCompany = (roles?: UserRole[]): MethodDecorator & ClassDecorator => {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(UserOrCompanyGuard))
}
