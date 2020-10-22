import { Injectable } from '@nestjs/common'
import { EnsureIndex } from '../../../src'

@EnsureIndex('test', [
  { name: 'my_cool_index', key: { public: 1 } },
  { name: 'my_other_cool_index', key: { other_field: 1 } },
])
@Injectable()
export class TestDocument {}
