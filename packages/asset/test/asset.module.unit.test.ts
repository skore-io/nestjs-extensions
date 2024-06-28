import { suite, test } from '@testdeck/jest'
import { AssetClientEnum } from '../src/enum'
import { CloudinaryClient, S3Client } from '../src/client'
import { testModule } from './test.module'

@suite
export class AssetModuleUnitTest {
  private cloudinaryClient: CloudinaryClient
  private s3Client: S3Client

  async before() {
    const module = await testModule()
    this.cloudinaryClient = module.get<CloudinaryClient>(AssetClientEnum.CLOUDINARY)
    this.s3Client = module.get<S3Client>(AssetClientEnum.S3)
  }

  @test
  async 'Should load AssetModule and inject clients'() {
    expect(this.cloudinaryClient).toBeInstanceOf(CloudinaryClient)
    expect(this.s3Client).toBeInstanceOf(S3Client)
  }
}
