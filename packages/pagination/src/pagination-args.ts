import { ArgsType, Field, Int } from '@nestjs/graphql'
import { IsInt, IsOptional } from 'class-validator'
import { Pagination } from './pagination'

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  skip?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  take?: number

  get pagination(): Pagination {
    return new Pagination(this.skip, this.take)
  }
}
