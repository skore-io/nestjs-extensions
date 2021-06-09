import { FactoryProvider } from '@nestjs/common'

export type MongoConnection = {
  /**
   * Connection string with database name
   *
   * @example <caption>Connecting to `contents` database with user: `user` pass: `pass` on `locahost:27017` with poolSize 10</caption>
   * `mongodb://user:pass@localhost:27017/contents?poolSize=10&appname=YOUR_APP_NAME`
   *
   * */
  connection: string
  connectionName?: string
}

export type MongoModuleOptions = Omit<FactoryProvider<MongoConnection>, 'provide'>
