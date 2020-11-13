# `@skore-io/pagination`

## Description

This lib provides pagination tools: validate input and format response.

## Installation

```bash
$ npm install --save @skore-io/pagination
```

## Usage

### Parameters

| Name           | Description                                        |
| -------------- | -------------------------------------------------- |
| `skip`: number | Offset to start the query.                         |
| `take`: number | Limit of documents per request. The maximum is 50. |

### Using it with graphql

1. Graphql query

```typescript
import { DocumentDto, PaginatedDocumentsDto, ArgsDto } from 'src/app/dto'

@Query(() => PaginatedDocumentsDto)
getDocuments(@Args() argsDto: ArgsDto): Promise<PaginatedDocumentsDto> {
  const items = [new DocumentDto()]
  const documents = new PaginatedDocumentsDto(items, items.length)

  return new PaginatedDocumentsDto(documents, 20)
}
```

2. Input class

```typescript
import { Field, ArgsType } from '@nestjs/graphql'
import { PaginationArgs } from '@skore-io/pagination'

@ArgsType()
export class ArgsDto extends PaginationArgs {
  @Field(() => String)
  id: string
}
```

3. Response class

```typescript
import { ObjectType } from '@nestjs/graphql'
import { PaginationResponse } from '@skore-io/pagination'
import { DocumentDto } from 'src/app/dto'

@ObjectType()
export class PaginatedDocumentsDto extends PaginationResponse(DocumentDto) {}
```

4. Call example

```graphql
query {
  getDocuments(id: "12345", take: 10, skip: 20) {
    items {
      id
    }
    total
  }
}
```
