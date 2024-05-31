export class PaginationResult<ItemType> {
  constructor(
    public documents: ItemType[],
    public total: number,
  ) {}
}
