import { suite, test } from '@testdeck/jest'
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'
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
  async '[upload] Given a valid file, then upload it with successfully'() {
    const fakeResult: UploadApiResponse = {
      public_id: 'ar95kwxnthxg6mio9qp3',
      width: 360,
      height: 450,
      format: 'png',
      resource_type: 'image',
      bytes: 203808,
      url: 'http://res.cloudinary.com/skore-staging4/image/upload/v1665764812/ar95kwxnthxg6mio9qp3.png',
      folder: 'companies/114/contents/image.png',
      access_mode: 'public',
    } as unknown as UploadApiResponse

    const fakeUpload = jest.spyOn(cloudinary.uploader, 'upload').mockResolvedValue(fakeResult)

    await this.cloudinaryClient.upload(114, 'contents', 'image.png')

    expect(fakeUpload).toHaveBeenCalledWith('image.png', {
      folder: 'companies/114/contents',
    })
  }

  @test
  async '[upload] Given a large file, then throw an error'() {
    const fakeUpload = jest.spyOn(cloudinary.uploader, 'upload').mockRejectedValue({
      error: {
        code: 'ENAMETOOLONG',
      },
    })

    await expect(this.cloudinaryClient.upload(114, 'contents', 'image.png')).rejects.toThrow(
      'ENAMETOOLONG',
    )
    expect(fakeUpload).toHaveBeenCalledWith('image.png', {
      folder: 'companies/114/contents',
    })
  }

  @test
  async '[delete] Should delete file with successfully'() {
    await expect(this.cloudinaryClient.delete()).rejects.toThrow('Not implemented yet')
  }
}
