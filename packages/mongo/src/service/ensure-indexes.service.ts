import { DiscoveryService } from '@golevelup/nestjs-discovery'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Db } from 'mongodb'
import { EnsureIndexOptions } from '../decorator'
@Injectable()
export class EnsureIndexesService implements OnModuleInit {
  constructor(
    private readonly db: Db,
    private readonly connectionName: string,
    private readonly discoveryService: DiscoveryService,
  ) {}

  async onModuleInit(): Promise<void> {
    const providers = await this.discoveryService.providersWithMetaAtKey<EnsureIndexOptions>(
      'ENSURE_INDEX',
    )
    const metadata = providers
      .filter(provider => provider.meta.connectionName === this.connectionName)
      .map(provider => provider.meta)

    for (const meta of metadata) {
      Logger.debug(
        `Ensuring indexes for ${meta.connectionName}:${meta.collection}`,
        EnsureIndexesService.name,
      )

      await this.db.collection(meta.collection).createIndexes(meta.ensureIndexOptions)
    }
  }
}
