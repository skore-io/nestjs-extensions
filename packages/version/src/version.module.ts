import { Module } from '@nestjs/common'
import { VersionDocument } from './document'

@Module({ imports: [VersionDocument] })
export class VersionModule {}
