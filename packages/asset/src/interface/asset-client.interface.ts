export interface AssetClientInterface {
  upload(): Promise<void>
  delete(): Promise<void>
}
