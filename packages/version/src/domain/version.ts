import { Expose, Transform } from 'class-transformer'
import { ObjectID } from 'mongodb'

export class Version<T> {
  @Transform((id: ObjectID) => id.toHexString(), { toClassOnly: true })
  @Expose()
  _id: string
  @Expose({ name: 'created_at' })
  createdAt: number
  @Transform((id: ObjectID) => id.toHexString(), { toClassOnly: true })
  @Expose({ name: 'document_id' })
  documentId: string
  @Expose({ name: 'document_collection' })
  documentCollection: string
  @Expose({ name: 'document_data' })
  documentData: T
}
