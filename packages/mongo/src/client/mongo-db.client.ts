import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common'
import { Db, MongoClient } from 'mongodb'

@Injectable()
export class MongoDbClient implements OnApplicationShutdown {
  private static connection: MongoClient
  private db: Db

  async init(): Promise<Db> {
    MongoDbClient.connection = await this.mongoClient()
    this.db = MongoDbClient.connection.db(process.env.DATABASE_NAME)

    return this.db
  }

  async onApplicationShutdown(signal: string): Promise<void> {
    Logger.debug(`Application received shutdown with signal: ${signal}.`, MongoDbClient.name)
    await MongoDbClient.connection.close()
    Logger.debug('Connection with MongoDb closed. ', MongoDbClient.name)
  }

  private async mongoClient(): Promise<MongoClient> {
    return MongoClient.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }
}
