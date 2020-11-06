import { HttpModule, Module, UseGuards } from '@nestjs/common'
import { GraphQLModule, Query, Resolver } from '@nestjs/graphql'
import { KeycloakModule } from '../../src'
import { KeycloakClient } from '../../src/client'
import { Protected } from '../../src/decorator'
import { KeycloakGuard } from '../../src/guard'
import { ValidateAccessTokenService } from '../../src/service'

@Resolver(() => String)
class ResolverOne {
  @Query(() => String)
  public(): string {
    return 'Public'
  }
  @Query(() => String)
  @Protected()
  protected(): string {
    return 'protected'
  }

  @Query(() => String)
  @UseGuards(KeycloakGuard)
  misused(): string {
    return 'Misused'
  }
}

@Module({
  imports: [
    KeycloakModule,
    GraphQLModule.forRoot({ autoSchemaFile: true, context: ({ req }) => req }),
    HttpModule,
  ],
  providers: [ResolverOne, ValidateAccessTokenService, KeycloakClient],
})
export class GqlModule {}
