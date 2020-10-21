import { Expose } from 'class-transformer'

export class Version<T> {
  @Expose()
  id: string
  @Expose({ name: 'created_at' })
  createdAt: number
  @Expose({ name: 'document_id' })
  documentId: string
  @Expose({ name: 'document_type' })
  documentType: string
  @Expose({ name: 'document_data' })
  documentData: T
}
