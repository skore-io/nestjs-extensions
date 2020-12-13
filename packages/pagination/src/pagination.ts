export class Pagination {
  static readonly MIN_SKIP: number = 0
  static readonly MIN_TAKE: number = 1
  static readonly MAX_TAKE: number = 50

  private readonly _skip: number
  private readonly _take: number

  constructor(skip: number, take: number) {
    this._skip = skip
    this._take = take
  }

  get skip(): number {
    return this._skip
  }

  get take(): number {
    if (this._take === null || this._take === undefined) return Pagination.MAX_TAKE
    if (this._take < Pagination.MIN_TAKE) return Pagination.MIN_TAKE
    if (this._take > Pagination.MAX_TAKE) return Pagination.MAX_TAKE

    return this._take
  }
}
