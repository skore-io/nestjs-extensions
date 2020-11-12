import { Field, ObjectType } from '@nestjs/graphql'
import { ClassType } from 'class-transformer/ClassTransformer'

export function PaginationResponse<ItemType>(ItemClass: ClassType<ItemType>): unknown {
  @ObjectType({ isAbstract: true })
  abstract class PaginationResponseClass {
    constructor(items: ItemType[], total: number) {
      this.items = items
      this.total = total
    }

    @Field(() => [ItemClass])
    items: ItemType[]

    @Field()
    total: number
  }

  return PaginationResponseClass
}
