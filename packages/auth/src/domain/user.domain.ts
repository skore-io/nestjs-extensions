/* eslint-disable @typescript-eslint/no-explicit-any */
import { Expose, Transform, Type } from 'class-transformer'
import { Team } from './team.domain'
import { TransformerUtil } from '../util'
import { UserRole } from '../enum'

export class User extends TransformerUtil {
  @Transform(({ value }) => String(value))
  @Expose()
  id!: string

  @Transform(({ value }) => String(value))
  @Expose({ name: 'company_id' })
  companyId!: string

  @Expose()
  role!: UserRole

  @Expose()
  name!: string

  @Expose()
  username?: string

  @Expose()
  email?: string

  @Expose()
  avatar?: string

  @Expose()
  metadata?: any

  @Expose()
  @Transform(({ value }) => value || {})
  preferences?: any

  @Type(() => Team)
  @Transform(({ value }) => value || [])
  @Expose()
  teams: Team[] = []

  @Expose({ name: 'created_at' })
  createdAt!: number

  @Transform(({ value }) => Number(value))
  @Expose({ name: 'session_id' })
  sessionId!: number

  get teamIds(): string[] {
    return this.teams.map((team) => team.id)
  }

  isAdmin(): boolean {
    return this.role === UserRole.admin
  }

  isExpert(): boolean {
    return this.role === UserRole.expert
  }

  isStudent(): boolean {
    return this.role === UserRole.student
  }
}
