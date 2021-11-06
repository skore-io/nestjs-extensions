import { Controller, Get, Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { KeycloakModule } from '../../src'
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
  providers: [],
})
export class RestModule {}
