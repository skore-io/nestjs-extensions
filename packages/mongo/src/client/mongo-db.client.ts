import { Injectable, Logger, OnApplicationShutdown, ShutdownSignal } from '@nestjs/common'
import { Db, MongoClient } from 'mongodb'
@Injectable()
export class MongoDbClient implements OnApplicationShutdown {
  constructor(
    private readonly mongoClient: MongoClient,
    private readonly mongoConnectionName: String,
  ) {}

  async db(): Promise<Db> {
    const database = await this.mongoClient.connect()
    return database.db(process.env.MONGO_DATABASE_NAME || '')
  }

  async onApplicationShutdown(signal: ShutdownSignal): Promise<void> {
    Logger.debug(
      `Application received shutdown with signal: ${signal}. for ${this.mongoConnectionName}`,
      MongoDbClient.name,
    )

    if (this.mongoClient?.isConnected()) await this.mongoClient.close()

    Logger.debug('Connection with MongoDb closed. ', MongoDbClient.name)
  }
}
