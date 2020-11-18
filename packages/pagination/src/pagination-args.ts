import { ArgsType, Field, Int } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import { IsInt, Min } from 'class-validator'
import { Pagination } from './pagination'

@ArgsType()
export class PaginationArgs {
  public static readonly MIN_SKIP: number = 0
  public static readonly MIN_TAKE: number = 1
  public static readonly MAX_TAKE: number = 50

  @Field(() => Int)
  @IsInt()
  @Min(PaginationArgs.MIN_SKIP)
  @Transform(value => value || PaginationArgs.MIN_SKIP)
  skip: number = PaginationArgs.MIN_SKIP

  @Field(() => Int)
  @IsInt()
  @Transform(value => {
    if (value < PaginationArgs.MIN_TAKE) return PaginationArgs.MIN_TAKE
    if (value > PaginationArgs.MAX_TAKE) return PaginationArgs.MAX_TAKE

    return PaginationArgs.MAX_TAKE
  })
  take: number = PaginationArgs.MAX_TAKE

  get pagination(): Pagination {
    return new Pagination(this.skip, this.take)
  }
}
