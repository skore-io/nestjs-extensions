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
  async '[upload] Given a valid file, then upload it with successfully'() {
    await expect(this.s3Client.upload(114, 'contents', 'file.pdf')).rejects.toThrow(
      'Not implemented yet',
    )
  }

  @test
  async '[delete] Should delete file with successfully'() {
    await expect(this.s3Client.delete()).rejects.toThrow('Not implemented yet')
  }
}
