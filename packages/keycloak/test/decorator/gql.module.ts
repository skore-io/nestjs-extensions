import { HttpModule, Logger, Module } from '@nestjs/common'
import { GraphQLModule, Query, Resolver } from '@nestjs/graphql'
import { KeycloakModule } from '../../src'
import { KeycloakClient } from '../../src/client'
import { Protected } from '../../src/decorator'
import { GetUser } from '../../src/decorator/get-user.decorator'
import { User } from '../../src/domain'

@Resolver(() => String)
class ResolverOne {
  @Query(() => String)
  public(): string {
    return 'Public'
  }
  @Query(() => String)
  @Protected()
  protected(@GetUser() currentUser: User): string {
    Logger.debug(currentUser.id, 'HAHA')
    return 'protected' + currentUser.id
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
