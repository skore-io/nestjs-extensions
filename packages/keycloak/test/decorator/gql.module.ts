import { HttpModule, Logger, Module } from '@nestjs/common'
import { GraphQLModule, Query, Resolver } from '@nestjs/graphql'
import { KeycloakModule } from '../../src'
import { GetUser, Protected } from '../../src/decorator'
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
    Logger.log(currentUser.id, ResolverOne.name)
    return 'protected' + currentUser.id
  }
}

@Module({
  imports: [
    KeycloakModule,
    GraphQLModule.forRoot({ autoSchemaFile: true, context: ({ req }) => req }),
    HttpModule,
  ],
  providers: [ResolverOne],
})
export class GqlModule {}
