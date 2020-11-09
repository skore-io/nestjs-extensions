import { Controller, Get, HttpModule, Module, UseGuards } from '@nestjs/common'
import { KeycloakModule } from '../../src'
import { KeycloakClient } from '../../src/client'
import { Protected } from '../../src/decorator'
import { KeycloakGuard } from '../../src/guard'

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
  providers: [KeycloakClient],
})
export class RestModule {}
