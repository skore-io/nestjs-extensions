const BASE64 = 'base64'
const INVALID_TOKEN = 'Invalid token'

export class KeycloakUtils {
  static realmFromToken(token: string): string {
    try {
      const [, payload] = token.split('.')

      const data = JSON.parse(Buffer.from(payload, BASE64).toString())

      return data.iss.substring(data.iss.lastIndexOf('/') + 1)
    } catch (error) {
      throw new Error(INVALID_TOKEN)
    }
  }
}
