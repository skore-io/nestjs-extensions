import { DiscoveryService } from '@golevelup/nestjs-discovery'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Db } from 'mongodb'
import { EnsureIndexOptions } from '../decorator'
import { ENSURE_INDEX } from '../domain'
@Injectable()
export class EnsureIndexesService implements OnModuleInit {
  constructor(
    private readonly db: Db,
    private readonly connectionName: string,
    private readonly discoveryService: DiscoveryService,
  ) {}

  async onModuleInit(): Promise<void> {
    const providers = await this.discoveryService.providersWithMetaAtKey<EnsureIndexOptions>(
      ENSURE_INDEX,
    )
    const indexOptions = providers
      .filter(provider => provider.meta.connectionName === this.connectionName)
      .map(provider => provider.meta)

    for (const option of indexOptions) {
      Logger.debug(
        `Ensuring indexes for ${option.connectionName}:${option.collection}`,
        EnsureIndexesService.name,
      )

      await this.db.collection(option.collection).createIndexes(option.ensureIndexOptions)
    }
  }
}
