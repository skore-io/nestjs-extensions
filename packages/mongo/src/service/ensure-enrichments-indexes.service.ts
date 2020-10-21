import { Collection, Db } from 'mongodb'
import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common'

@Injectable()
export class EnsureEnrichmentsIndexesService implements OnApplicationBootstrap {
  private readonly SEVEN_DAYS = 3600 * 24 * 7

  private readonly collection: Collection<unknown>

  constructor(db: Db) {
    this.collection = db.collection('enrichments')
  }

  async onApplicationBootstrap(): Promise<void> {
    Logger.debug('Ensuring indexes for enrichments', EnsureEnrichmentsIndexesService.name)
    await this.createEnrichmentIndexes()
  }

  private async createEnrichmentIndexes(): Promise<void> {
    await this.collection.createIndexes([
      { name: 'enrichments_on_content_id', key: { content_id: 1 } },
      {
        name: 'enrichments_expires_after_seven_days',
        key: { created_at: 1 },
        expireAfterSeconds: this.SEVEN_DAYS,
      },
    ])
  }
}
