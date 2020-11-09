import { HttpModule, Module } from '@nestjs/common'
import { GraphQLModule, Query, Resolver } from '@nestjs/graphql'
import { KeycloakModule } from '../../src'
import { KeycloakClient } from '../../src/client'
import { Protected } from '../../src/decorator'

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
}

@Module({
  imports: [
    KeycloakModule,
    GraphQLModule.forRoot({ autoSchemaFile: true, context: ({ req }) => req }),
    HttpModule,
  ],
  providers: [ResolverOne, KeycloakClient],
})
export class GqlModule {}
