export type PaginationType = {
  skip: number
  take: number
}

export type PaginationResultType<T> = {
  items: Omit<T, 'total'>[]
  total: number
}
