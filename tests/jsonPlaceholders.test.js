import axios from 'axios';

describe('JSON Placeholder', () => {
  const BASE_URL = 'https://jsonplaceholder.typicode.com';
  let user

  test('1. Get all posts', async () => {
    const response = await axios.get(`${BASE_URL}/posts`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data[0]).toHaveProperty('id');

    const ids = response.data.map(post => post.id);
    const sortedIds = [...ids].sort((a, b) => a - b);
    expect(ids).toEqual(sortedIds);
  });

  test('2. Get post with exact ID', async () => {
    const response = await axios.get(`${BASE_URL}/posts/99`)
    const post = response.data
    
    expect(response.status).toBe(200);
    expect(post.userId).toBe(10);
    expect(post.id).toBe(99);
    expect(post.title).not.toBeNull()
    expect(post.body).not.toBeNull()
    
  });

  test('3. Get post with id=150', async () => {
    const response = await axios.get(`${BASE_URL}/posts/150`,{
      validateStatus: () => true
    });

    expect(response.status).toBe(404);
    expect(response.data).toEqual({})
  });

  test('4. Create post with userid = 1', async () => {
    const requestData = {
      userId: 1,
      title: `testTitle`,
      body: `testBody`
    };
    const response = await axios.post(`${BASE_URL}/posts`, requestData);

    expect(response.status).toBe(201);

    expect(response.data.title).toBe(requestData.title);
    expect(response.data.body).toBe(requestData.body);
    expect(response.data.userId).toBe(requestData.userId);

    expect(response.data).toHaveProperty('id');
  })

  test('5. Check the exact users data', async () => {
    const response = await axios.get(`${BASE_URL}/users`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);

    user = response.data.find(u => u.id === 5);
    expect(user).toBeDefined();

    expect(user.name).toBe('Chelsey Dietrich');
    expect(user.username).toBe('Kamren');
    expect(user.email).toBe('Lucio_Hettinger@annie.ca');
    expect(user.phone).toBe('(254)954-1289');
    expect(user.website).toBe('demarco.info');

    expect(user.address).toMatchObject({
      street: 'Skiles Walks',
      suite: 'Suite 351',
      city: 'Roscoeview',
      zipcode: '33263',
      geo: {
        lat: '-31.8129',
        lng: '62.5342'
      }
    });

    expect(user.company).toMatchObject({
    name: 'Keebler LLC',
    catchPhrase: 'User-centric fault-tolerant solution',
    bs: 'revolutionize end-to-end systems'
    });
  })

  test('6. Get the user with id = 5', async () => {
    const response = await axios.get(`${BASE_URL}/users/5`);
    expect(response.status).toBe(200);
    
    const userData = response.data;
    expect(userData).toEqual(user)
  })
});
