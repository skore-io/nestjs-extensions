import { AssetUploadResponse } from '../type'

export interface AssetClientInterface {
  upload(companyId: number, folder: string, file: string): Promise<AssetUploadResponse>
  delete(): Promise<void>
}
