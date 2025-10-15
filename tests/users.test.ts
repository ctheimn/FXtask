import { UsersApi } from '../src/api/usersApi';
import { User } from '../src/models/User';
import usersData from './testData/userData.json';

describe('Users API Tests', () => {
  const api = new UsersApi();
  let initialUser: User;
  const { user5 } = usersData

  beforeAll(async () => {
    const response = await api.getUserById(user5.id);
    expect(response.status).toBe(200);
    initialUser = response.data;
  });

  test('5. Check the exact users data', async () => {
    const expectedUser = usersData.user5;
    const response = await api.getUsers();

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true)

    const actualUser = response.data.find((u: any) => u.id === expectedUser.id);
    if (!actualUser) {
    throw new Error(`User with id=${expectedUser.id} not found in /users response`);
    }

    expect(actualUser).toMatchObject({
      id: expectedUser.id,
      name: expectedUser.name,
      username: expectedUser.username,
      email: expectedUser.email,
      phone: expectedUser.phone,
      website: expectedUser.website
    });

    expect(actualUser.address).toMatchObject(expectedUser.address);

    expect(actualUser.company).toMatchObject(expectedUser.company);
  });

  test('6. Verify user data remains the same on repeated request', async () => {
    const response = await api.getUserById(user5.id);
    expect(response.status).toBe(200);

    const repeatedUser = response.data;

    if (initialUser) {
      expect(repeatedUser).toEqual(initialUser);
    } else {
      expect(repeatedUser.id).toBe(user5.id);
      expect(repeatedUser.name).toBe(user5.name);
    }
  });
});
