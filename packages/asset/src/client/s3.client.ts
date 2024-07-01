import { Injectable } from '@nestjs/common'
import { AssetClientInterface } from '../interface'
import { AssetUploadResponse } from '../type'

@Injectable()
export class S3Client implements AssetClientInterface {
  async upload(companyId: number, folder: string, file: string): Promise<AssetUploadResponse> {
    Promise.resolve({ companyId, folder, file })
    throw Error('Not implemented yet')
  }

  async delete(): Promise<void> {
    throw Error('Not implemented yet')
  }
}
