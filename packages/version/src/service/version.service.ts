import { Injectable } from '@nestjs/common'
import { VersionDocument } from '../document'
import { Version } from '../domain'

@Injectable()
export class VersionService {
  constructor(private readonly versionDocument: VersionDocument) {}

  findVersionsFor<T>(documentCollection: string, documentId: string): Promise<Version<T>[]> {
    return this.versionDocument.findVersionsFor<T>(documentCollection, documentId)
  }

  findLatestVersionFor<T>(documentCollection: string, documentId: string): Promise<Version<T>> {
    return this.versionDocument.findLatestVersionFor(documentCollection, documentId)
  }
}
