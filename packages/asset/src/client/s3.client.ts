import { Injectable } from '@nestjs/common'
import { AssetClientInterface } from '../interface'

@Injectable()
export class S3Client implements AssetClientInterface {
  async upload(): Promise<void> {
    throw Error('Not implemented yet')
  }

  async delete(): Promise<void> {
    throw Error('Not implemented yet')
  }
}
