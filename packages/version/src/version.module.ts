import { Module } from '@nestjs/common'
import { VersionDocument } from './document'
import { VersionService } from './service'

@Module({ providers: [VersionDocument, VersionService], exports: [VersionService] })
export class VersionModule {}
