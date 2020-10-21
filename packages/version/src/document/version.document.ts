import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { Collection, Db, ObjectID } from 'mongodb'
import { Version } from '../domain'

@Injectable()
export class VersionDocument {
  private readonly collection: Collection

  constructor(db: Db) {
    this.collection = db.collection('versions')
  }

  async findVersionsFor<T>(documentCollection: string, documentId: string): Promise<Version<T>[]> {
    const versions = await this.collection
      .find({ document_collection: documentCollection, document_id: new ObjectID(documentId) })
      .sort({ created_at: -1 })
      .toArray()

    return plainToClass(Version, versions)
  }

  async findLatestVersionFor<T>(
    documentCollection: string,
    documentId: string,
  ): Promise<Version<T>> {
    const version = await this.collection.findOne(
      {
        document_collection: documentCollection,
        document_id: new ObjectID(documentId),
      },
      { sort: { created_at: -1 } },
    )

    return plainToClass(Version, version)
  }
}
