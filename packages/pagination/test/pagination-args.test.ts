import { suite, test } from '@testdeck/jest'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { PaginationArgs } from '../src/pagination-args'

@suite('[Pagination] Pagination Args')
export class PaginationArgsTest {
  @test()
  'Skip defaults to PaginationArgs.MIN_SKIP when not provided'() {
    const pagination = plainToClass(PaginationArgs, {})
    expect(pagination.skip).toEqual(PaginationArgs.MIN_SKIP)
  }

  @test()
  async 'Skip produces validation errors when smaller than PaginationArgs.MIN_SKIP'() {
    const pageArgs = plainToClass(PaginationArgs, { skip: -10 })
    expect(pageArgs.skip).toBeLessThan(PaginationArgs.MIN_SKIP)

    const [error] = await validate(pageArgs)

    expect(error.property).toBe('skip')
    expect(error.constraints.min).toEqual(`skip must not be less than ${PaginationArgs.MIN_SKIP}`)
  }

  @test()
  'Take defaults to PaginationArgs.MAX_TAKE when not provided'() {
    const pagination = plainToClass(PaginationArgs, {})
    expect(pagination.take).toEqual(PaginationArgs.MAX_TAKE)
  }

  @test()
  async 'Take the default maximum value when greater than PaginationArgs.MAX_TAKE'() {
    const pageArgs = plainToClass(PaginationArgs, { take: 60 })
    expect(pageArgs.take).toEqual(PaginationArgs.MAX_TAKE)
  }

  @test()
  async 'Take the default minimum value when smaller than PaginationArgs.MIN_TAKE'() {
    const pageArgs = plainToClass(PaginationArgs, { take: -10 })
    expect(pageArgs.take).toEqual(PaginationArgs.MIN_TAKE)
  }
}
