import { Module } from '@nestjs/common'
import { VersionDocument } from './document'

@Module({ providers: [VersionDocument] })
export class VersionModule {}
