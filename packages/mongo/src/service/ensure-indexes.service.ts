import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Db, IndexSpecification } from 'mongodb'

@Injectable()
export class EnsureIndexesService implements OnModuleInit {
  private static INDEX_LIST = new Set()
  constructor(private readonly db: Db) {}

  static registerIndex(name: string, indexSpecification: IndexSpecification): void {
    if (!EnsureIndexesService.INDEX_LIST[name]) EnsureIndexesService.INDEX_LIST[name] = []
    EnsureIndexesService.INDEX_LIST[name].push(indexSpecification)
  }

  async onModuleInit(): Promise<void> {
    Object.keys(EnsureIndexesService.INDEX_LIST).forEach(async collectionName => {
      Logger.debug(`Ensuring indexes for ${collectionName}`, EnsureIndexesService.name)
      await this.db
        .collection(collectionName)
        .createIndexes(EnsureIndexesService.INDEX_LIST[collectionName])
    })
  }
}
