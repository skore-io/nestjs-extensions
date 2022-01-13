import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { UserRole } from '../enum'
import { AdminOrCompanyGuard } from '../guard'

export const IsAdminOrCompany = (roles?: UserRole[]): MethodDecorator & ClassDecorator => {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(AdminOrCompanyGuard))
}
