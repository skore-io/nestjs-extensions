import { SetMetadata } from '@nestjs/common'
import { IndexSpecification } from 'mongodb'
import { DEFAULT_CONNECTION_NAME, ENSURE_INDEX } from '../domain'

export type EnsureIndexOptions = {
  collection: string
  ensureIndexOptions: IndexSpecification[]
  connectionName?: string
}

/*
 * Register collection indexes
 * @param {EnsureIndexOptions} options - The index details
 * @param {string} options.collection - Collection to create indexes
 * @param {IndexSpecification[]} options.ensureIndexOptions - A list of indexes in { key, name } format
 * @param {string} options.collectionName - The connection name specified on MongoModule.register() (Ignore if none passed to MongoModule)
 */
export const EnsureIndex = (options: EnsureIndexOptions): ClassDecorator => {
  return SetMetadata(ENSURE_INDEX, { ...{ connectionName: DEFAULT_CONNECTION_NAME }, ...options })
}
