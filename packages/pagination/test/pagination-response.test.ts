import { suite, test } from '@testdeck/jest'
import { Field } from '@nestjs/graphql'
import { PaginationResponse } from '../src/pagination-response'

class DocumentDto {
  constructor(id: string) {
    this.id = id
  }

  @Field()
  id: string
}
class PaginatedDocumentsDto extends PaginationResponse(DocumentDto) {}

@suite('[Pagination] Pagination Response')
export class PaginationArgsTest {
  @test()
  'Given two documents then return pagination response'() {
    const documents = [new DocumentDto('1234'), new DocumentDto('4321')]
    const paginationResponse = new PaginatedDocumentsDto(documents, documents.length)

    expect(paginationResponse.items).toHaveLength(2)
    expect(paginationResponse.total).toEqual(2)
  }
}
