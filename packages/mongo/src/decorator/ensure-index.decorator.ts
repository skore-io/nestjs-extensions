import { SetMetadata } from '@nestjs/common'
import { IndexSpecification } from 'mongodb'

export type EnsureIndexOptions = {
  collection: string
  ensureIndexOptions: IndexSpecification[]
  connectionName?: string
}

export const EnsureIndex = (options: EnsureIndexOptions): ClassDecorator =>
  SetMetadata('ENSURE_INDEX', options)
