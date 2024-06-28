import { Test, TestingModule } from '@nestjs/testing'
import { AssetModule } from '../src/asset.module'

export const testModule = (): Promise<TestingModule> =>
  Test.createTestingModule({
    imports: [AssetModule.register()],
  }).compile()
