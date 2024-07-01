import { Module, DynamicModule, Provider } from '@nestjs/common'
import { AssetClientEnum } from './enum'
import { CloudinaryClient, S3Client } from './client'
import { ConfigModule } from '@nestjs/config'

@Module({})
export class AssetModule {
  static register(): DynamicModule {
    const providers: Provider[] = [
      {
        provide: AssetClientEnum.CLOUDINARY,
        useClass: CloudinaryClient,
      },
      {
        provide: AssetClientEnum.S3,
        useClass: S3Client,
      },
    ]

    return {
      module: AssetModule,
      imports: [ConfigModule.forRoot()],
      providers,
      exports: providers,
    }
  }
}
