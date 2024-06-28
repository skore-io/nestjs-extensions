import { suite, test } from '@testdeck/jest'
import { AssetClientEnum } from '../../../src/enum'
import { CloudinaryClient } from '../../../src/client'
import { testModule } from '../../test.module'

@suite
export class CloudinaryClientUnitTest {
  private cloudinaryClient: CloudinaryClient

  async before() {
    const module = await testModule()

    this.cloudinaryClient = module.get<CloudinaryClient>(AssetClientEnum.CLOUDINARY)
  }

  @test
  async 'Should upload file to Cloudinary'() {
    await expect(this.cloudinaryClient.upload()).rejects.toThrow('Not implemented yet')
  }

  @test
  async 'Should delete file of Cloudinary'() {
    await expect(this.cloudinaryClient.upload()).rejects.toThrow('Not implemented yet')
  }
}
