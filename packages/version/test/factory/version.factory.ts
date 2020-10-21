import { TestingModule } from '@nestjs/testing'
import { Db, ObjectID } from 'mongodb'

type Version = { docId?: string; createdAt?: number; title?: string }

export class VersionFactory {
  static async createWithIds(moduleRef: TestingModule, ...versions: Version[]): Promise<void> {
    const db = moduleRef.get(Db)
    await db.collection('versions').insertMany(
      versions.map(({ docId, createdAt: createdAt, title }, index) => ({
        created_at: createdAt ?? Date.now(),
        document_id: docId ?? VersionFactory.mongoId(),
        document_type: 'contents',
        document_data: {
          title: title ?? `Sample ${index}`,
        },
      })),
    )
  }

  static mongoId(): string {
    return ObjectID.createFromTime(Date.now()).toHexString()
  }
}
