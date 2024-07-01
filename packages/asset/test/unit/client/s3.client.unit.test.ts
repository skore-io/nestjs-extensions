import { suite, test } from '@testdeck/jest'
import { AssetClientEnum } from '../../../src/enum'
import { S3Client } from '../../../src/client'
import { testModule } from '../../test.module'

@suite
export class S3ClientUnitTest {
  private s3Client: S3Client

  async before() {
    const module = await testModule()

    this.s3Client = module.get<S3Client>(AssetClientEnum.S3)
  }

  @test
  async 'Should upload file to S3'() {
    await expect(this.s3Client.upload()).rejects.toThrow('Not implemented yet')
  }

  @test
  async 'Should delete file of S3'() {
    await expect(this.s3Client.delete()).rejects.toThrow('Not implemented yet')
  }
}
