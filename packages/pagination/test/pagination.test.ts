import { suite, test } from '@testdeck/jest'
import { Pagination } from '../src/pagination'

@suite('[Pagination] Pagination Test')
export class PaginationTest {
  @test()
  'Given "take" null then return the default maximum value'() {
    const pagination = new Pagination(1, null)
    expect(pagination.take).toEqual(Pagination.MAX_TAKE)
  }

  @test()
  'Given "take" greater than MAX_TAKE then return the default maximum value'() {
    const pagination1 = new Pagination(1, 60)
    expect(pagination1.take).toEqual(Pagination.MAX_TAKE)
  }

  @test()
  'Given "take" smaller than MIN_TAKE then return the default minimum value'() {
    const pagination = new Pagination(1, 0)
    expect(pagination.take).toEqual(Pagination.MIN_TAKE)
  }

  @test()
  'Given a valid "take" then return it'() {
    const pagination = new Pagination(1, 10)
    expect(pagination.take).toEqual(10)
  }
}
