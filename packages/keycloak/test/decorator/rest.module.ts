import { Controller, Get, HttpModule, Module, UseGuards } from '@nestjs/common'
import { KeycloakModule } from '../../src'
import { KeycloakClient } from '../../src/client'
import { Protected } from '../../src/decorator'
import { KeycloakGuard } from '../../src/guard'
import { ValidateAccessTokenService } from '../../src/service'

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
  imports: [KeycloakModule, HttpModule],
  providers: [ValidateAccessTokenService, KeycloakClient],
})
export class RestModule {}
