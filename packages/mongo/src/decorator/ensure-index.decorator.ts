import { SetMetadata } from '@nestjs/common'
import { IndexSpecification } from 'mongodb'
import { DEFAULT_CONNECTION_NAME, ENSURE_INDEX } from '../domain'

export type EnsureIndexOptions = {
  collection: string
  ensureIndexOptions: IndexSpecification[]
  connectionName?: string
}

export const EnsureIndex = (options: EnsureIndexOptions): ClassDecorator => {
  return SetMetadata(ENSURE_INDEX, { ...{ connectionName: DEFAULT_CONNECTION_NAME }, ...options })
}
