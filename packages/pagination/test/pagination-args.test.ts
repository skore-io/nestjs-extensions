import { suite, test } from '@testdeck/jest'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { PaginationArgs } from '../src/pagination-args'

@suite('[Pagination] Pagination Args')
export class PaginationArgsTest {
  @test()
  async 'Given a not integer "skip" then throw error'() {
    const paginationArgs = plainToClass(PaginationArgs, { skip: '10' })

    const [error] = await validate(paginationArgs)

    expect(error.property).toBe('skip')
    expect(error.constraints.isInt).toEqual('skip must be an integer number')
  }

  @test()
  async 'Given a not integer "take" then throw error'() {
    const paginationArgs = plainToClass(PaginationArgs, { take: '50' })

    const [error] = await validate(paginationArgs)

    expect(error.property).toBe('take')
    expect(error.constraints.isInt).toEqual('take must be an integer number')
  }
}
