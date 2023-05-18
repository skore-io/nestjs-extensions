import { KeycloakTokenTypeEnum } from '../enum'

export type TokenKeycloakType = {
  access_token: string
  expires_in: number
  refresh_expires_in: number
  token_type: KeycloakTokenTypeEnum
  'not-before-policy': number
  scope: string
}

export type ValidateTokeType = {
  exp?: number
  iat?: number
  jti?: string
  iss?: string
  sub?: string
  typ?: KeycloakTokenTypeEnum
  azp?: string
  preferred_username?: string
  email_verified?: boolean
  acr?: string
  scope?: string
  clientId?: string
  clientHost?: string
  clientAddress?: string
  client_id?: string
  username?: string
  active: boolean
}
