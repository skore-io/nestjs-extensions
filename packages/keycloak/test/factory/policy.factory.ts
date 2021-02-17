import * as faker from 'faker'
import axios from 'axios'

export class PolicyFactory {
  constructor(private readonly accessToken: string) {}

  async create(userIds: string[]): Promise<unknown> {
    const { data } = await axios.post(
      `${process.env.KEYCLOAK_SERVER_URL}/auth/realms/skore/authz/protection/uma-policy/18ee88a4-cd72-4e0d-9304-15abe6101b45`,
      {
        name: faker.name.title(),
        scopes: ['edit'],
        users: userIds,
      },
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    )

    return data
  }
}
