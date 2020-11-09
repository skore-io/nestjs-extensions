import { Controller, Get, HttpModule, Module } from '@nestjs/common'
import { KeycloakModule } from '../../src'
import { KeycloakClient } from '../../src/client'
import { Protected } from '../../src/decorator'

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
}

@Module({
  controllers: [ControllerOne],
  imports: [KeycloakModule, HttpModule],
  providers: [KeycloakClient],
})
export class RestModule {}
