import { Expose, Transform } from 'class-transformer'

export class Version<T> {
  @Transform(({ value }) => value.toHexString(), { toClassOnly: true })
  @Expose()
  _id: string

  @Expose({ name: 'created_at' })
  createdAt: number

  @Transform(({ value }) => value.toHexString(), { toClassOnly: true })
  @Expose({ name: 'document_id' })
  documentId: string

  @Expose({ name: 'document_collection' })
  documentCollection: string

  @Expose({ name: 'document_data' })
  documentData: T
}
