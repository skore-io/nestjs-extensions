import { IndexSpecification } from 'mongodb'
import { EnsureIndexesService } from '../service'

export function EnsureIndex(
  collection: string,
  ensureIndexOptions: IndexSpecification[],
): Function {
  return function(): void {
    ensureIndexOptions.map(option => EnsureIndexesService.registerIndex(collection, option))
  }
}
