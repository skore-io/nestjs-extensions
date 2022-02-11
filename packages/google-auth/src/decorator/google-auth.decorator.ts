import { UseGuards } from '@nestjs/common'
import { GoogleAuthGuard } from '../guard'

export const GoogleAuth = (): MethodDecorator & ClassDecorator => {
  return UseGuards(GoogleAuthGuard)
}
