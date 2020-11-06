import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { KeycloakGuard } from '../guard'
import { PROTECTED } from '../constants'

export const Protected = (): MethodDecorator =>
  applyDecorators(SetMetadata(PROTECTED, true), UseGuards(KeycloakGuard))
