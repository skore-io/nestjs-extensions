import { UseGuards } from '@nestjs/common'
import { CompanyGuard } from '../guard'

export function IsCompany() {
  return UseGuards(CompanyGuard)
}
