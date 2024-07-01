import { Injectable, Logger } from '@nestjs/common'
import { AssetClientInterface } from '../interface'
import { v2 as cloudinary } from 'cloudinary'
import { ConfigService } from '@nestjs/config'
import { AssetUploadResponse } from '../type'

@Injectable()
export class CloudinaryClient implements AssetClientInterface {
  private readonly logger = new Logger(CloudinaryClient.name)

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      secure_distribution: this.configService.get('CLOUDINARY_CNAME'),
    })
  }

  async upload(companyId: number, folder: string, file: string): Promise<AssetUploadResponse> {
    try {
      const dir = `companies/${companyId}/${folder}`

      const response = await cloudinary.uploader.upload(file, {
        folder: dir,
      })

      return { source: response.public_id, ...response }
    } catch (error) {
      const errorResponse = error?.error?.code || error.message
      this.logger.error(`Error uploading to cloudinary: ${errorResponse}`)

      throw Error(errorResponse)
    }
  }

  async delete(): Promise<void> {
    throw Error('Not implemented yet')
  }
}
