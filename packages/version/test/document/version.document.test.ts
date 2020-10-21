import { Test, TestingModule } from '@nestjs/testing'
import { suite, test } from '@testdeck/jest'
import { ObjectID } from 'mongodb'
import { VersionDocument } from '../../src/document'
import { VersionFactory } from '../factory/version.factory'
import { TestModule } from '../module/test.module'

@suite('Version document test')
export class VersionDocumentTest {
  @test
  async 'Given document without versions then return empty list'() {
    const module = await this.getModule()
    const doc = module.get(VersionDocument)

    const versions = await doc.findVersionsFor(
      'contents',
      ObjectID.createFromTime(Date.now()).toHexString(),
    )

    expect(versions).toHaveLength(0)
  }

  @test
  async 'Given document with 1 version return it'() {
    const module = await this.getModule()
    const document = module.get(VersionDocument)
    const docId = VersionFactory.mongoId()
    await VersionFactory.createWithIds(module, { docId })

    const versions = await document.findVersionsFor<{ title: string }>('contents', docId)

    expect(versions).toHaveLength(1)
    expect(versions[0].documentId).toBe(docId)
    expect(versions[0].documentData.title).toBe('Sample 0')
  }

  @test
  async 'Given document with many versions return sorted'() {
    const createdAt = Date.now()
    const module = await this.getModule()
    const document = module.get(VersionDocument)
    const docId = VersionFactory.mongoId()

    await VersionFactory.createWithIds(module, { docId, createdAt }, { docId })

    const versions = await document.findVersionsFor<{ title: string }>('contents', docId)

    expect(versions).toHaveLength(2)
    expect(versions[0].documentData.title).toBe('Sample 1')
    expect(versions[1].documentData.title).toBe('Sample 0')
  }

  @test
  async 'Given document with many versions return latest version'() {
    const module = await this.getModule()
    const document = module.get(VersionDocument)

    await VersionFactory.createWithIds(module, { docId: null }, { docId: null })

    const docId = VersionFactory.mongoId()
    await VersionFactory.createWithIds(module, { docId, title: 'Sample latest' })

    const version = await document.findLatestVersionFor<{ title: string }>('contents', docId)

    expect(version.documentId).toBe(docId)
    expect(version.documentData.title).toBe('Sample latest')
  }

  private async getModule(): Promise<TestingModule> {
    const moduleRef = await Test.createTestingModule({ imports: [TestModule] }).compile()
    return moduleRef.init()
  }
}
