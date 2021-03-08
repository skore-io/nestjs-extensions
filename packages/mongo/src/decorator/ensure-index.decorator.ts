import { IndexSpecification } from 'mongodb'
import { EnsureIndexesService } from '../service'

/**
 *  Register collection indexes
 *
 * @param collection Collection to create indexes
 * @param ensureIndexOptions A list of indexes in { key, name } format
 */
export function EnsureIndex(
  collection: string,
  ensureIndexOptions: IndexSpecification[],
): Function {
  return function(): void {
    ensureIndexOptions.map(option => EnsureIndexesService.registerIndex(collection, option))
  }
}
