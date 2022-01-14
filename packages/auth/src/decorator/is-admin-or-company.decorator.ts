import { UseGuards } from '@nestjs/common'
import { AdminOrCompanyGuard } from '../guard'

export const IsAdminOrCompany = (): MethodDecorator & ClassDecorator => {
  return UseGuards(AdminOrCompanyGuard)
}
