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
  async 'Take produces validation errors when greater than PaginationArgs.MAX_TAKE'() {
    const pageArgs = plainToClass(PaginationArgs, { take: 10 ** 6 })
    expect(pageArgs.take).toBeGreaterThan(PaginationArgs.MAX_TAKE)

    const [error] = await validate(pageArgs)

    expect(error.property).toBe('take')
    expect(error.constraints.max).toEqual(
      `take must not be greater than ${PaginationArgs.MAX_TAKE}`,
    )
  }

  @test()
  async 'Take produces validation errors when smaller than PaginationArgs.MIN_TAKE'() {
    const pageArgs = plainToClass(PaginationArgs, { take: -10 })
    expect(pageArgs.take).toBeLessThan(PaginationArgs.MIN_TAKE)

    const [error] = await validate(pageArgs)

    expect(error.property).toBe('take')
    expect(error.constraints.min).toEqual(`take must not be less than ${PaginationArgs.MIN_TAKE}`)
  }
}
