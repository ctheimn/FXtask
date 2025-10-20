import { UsersApi } from '../src/api/usersApi';
import { User } from '../src/models/User';
import usersData from './testData/userData.json';
import 'jest-extended';

declare const allure: any;

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
    await allure.step('Send GET /users and verify user data', async () => {
      const expectedUser = usersData.user5;
      allure.parameter('Expected User ID', expectedUser.id);
      const response = await api.getUsers();
      allure.attachment('GET /users Response', JSON.stringify(response.data, null, 2), 'application/json');

      expect(response.status).toBe(200);
      expect(response.data).toBeArray();
      expect(response.data).not.toBeEmpty();

      const actualUser = response.data.find((u: any) => u.id === expectedUser.id);

      expect(actualUser).toEqual(
      expect.objectContaining({
          id: expectedUser.id,
          name: expectedUser.name,
          username: expectedUser.username,
          email: expectedUser.email,
          phone: expectedUser.phone,
          website: expectedUser.website,
          address: expect.objectContaining(expectedUser.address),
          company: expect.objectContaining(expectedUser.company),
        })
      );
    });
  });

  test('6. Verify user data remains the same on repeated request', async () => {
    await allure.step('Send repeated GET /users/{id} and compare with initial response', async () => {
      allure.parameter('User ID', user5.id);
      const response = await api.getUserById(user5.id);
      expect(response.status).toBe(200);

      const repeatedUser = response.data;

      expect(repeatedUser).toEqual(initialUser);
    });
  });
});
