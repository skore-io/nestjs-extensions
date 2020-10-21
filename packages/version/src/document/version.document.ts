import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { Collection, Db } from 'mongodb'
import { Version } from '../domain'

@Injectable()
export class VersionDocument {
  private readonly collection: Collection

  constructor(db: Db) {
    this.collection = db.collection('versions')
  }

  async findVersionsFor<T>(collection: string, id: string): Promise<Version<T>[]> {
    const documents = await this.collection
      .find({ document_type: collection, document_id: id })
      .sort({ created_at: -1 })
      .toArray()

    if (!documents.length) return []

    return plainToClass(Version, documents)
  }
}
