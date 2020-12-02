import axios from 'axios'
import { stringify } from 'querystring'

export class UserFactory {
  constructor(private readonly accessToken: string) {}

  async create(username: string): Promise<string> {
    const { headers } = await axios.post(
      `${process.env.KEYCLOAK_SERVER_URL}/auth/admin/realms/skore/users`,
      {
        username,
        enabled: true,
        credentials: [
          {
            type: 'password',
            value: 'bilu123',
            temporary: false,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    )

    return headers.location
      .split('/')
      .slice(-1)
      .pop()
  }

  async getToken(username: string): Promise<string> {
    const { data } = await axios.post(
      `${process.env.KEYCLOAK_SERVER_URL}/auth/realms/skore/protocol/openid-connect/token`,
      stringify({
        client_id: 'skore-front',
        grant_type: 'password',
        username,
        password: 'bilu123',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    )

    return data['access_token']
  }
}
