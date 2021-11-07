import { UseGuards } from '@nestjs/common'
import { CompanyGuard } from '../guard'

export function IsCompany(): MethodDecorator & ClassDecorator {
  return UseGuards(CompanyGuard)
}
