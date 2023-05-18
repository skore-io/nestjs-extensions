import { UseGuards } from '@nestjs/common'
import { ServiceGuard } from '../guard'

export const IsService = (): MethodDecorator & ClassDecorator => {
  return UseGuards(ServiceGuard)
}
