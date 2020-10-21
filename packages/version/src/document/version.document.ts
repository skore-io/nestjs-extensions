import { Injectable } from '@nestjs/common'
import { Collection, Db } from 'mongodb'
import { Version } from '../domain'

@Injectable()
export class VersionDocument {
  private readonly collection: Collection

  constructor(db: Db) {
    this.collection = db.collection('versions')
  }

  async findVersionsFor<T>(collection: string, id: string): Promise<Version<T>[]> {
    return Promise.resolve(null)
  }
}
