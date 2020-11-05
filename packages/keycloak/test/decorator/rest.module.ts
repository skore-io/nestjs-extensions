import { Controller, Get, Module, UseGuards } from '@nestjs/common'
import { ValidateAccessTokenService } from '../../src/service'
import { KeycloakModule } from '../../src'
import { Protected } from '../../src/decorator'
import { KeycloakGuard } from '../../src/guard'
import { KeycloakClient } from '../../src/client'

@Controller()
class ControllerOne {
  @Get('public')
  public(): string {
    return 'Public'
  }
  @Get('protected')
  @Protected()
  protected(): string {
    return 'Protected'
  }

  @Get('misused')
  @UseGuards(KeycloakGuard)
  misused(): string {
    return 'Misused'
  }
}

@Module({
  controllers: [ControllerOne],
  imports: [KeycloakModule],
  providers: [ValidateAccessTokenService, KeycloakClient],
})
export class RestModule {}
