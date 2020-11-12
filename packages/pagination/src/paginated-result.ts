export class PaginatedResult<ItemType> {
  constructor(public documents: ItemType[], public total: number) {}
}
