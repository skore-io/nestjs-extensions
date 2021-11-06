import { Field, Int, ObjectType } from '@nestjs/graphql'
import { ClassType } from 'class-transformer/esm5'

export function PaginationResponse<ItemType>(ItemClass: ClassType<ItemType>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginationResponseClass {
    constructor(items: ItemType[], total: number) {
      this.items = items
      this.total = total
    }

    @Field(() => [ItemClass])
    items: ItemType[]

    @Field(() => Int)
    total: number
  }

  return PaginationResponseClass as new (items: ItemType[], total: number) => {
    [key in keyof PaginationResponseClass]: PaginationResponseClass[key]
  }
}
