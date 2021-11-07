import { UseGuards } from '@nestjs/common'
import { CompanyGuard } from '../guard'

export const IsCompany = (): MethodDecorator & ClassDecorator => {
  return UseGuards(CompanyGuard)
}
