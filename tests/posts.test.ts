import { PostsApi } from '../src/api/postApi';
import postsData from './testData/postsData.json'; 
import { faker } from '@faker-js/faker';
import mb from 'mountebank';
describe('Posts API', () => {
  const postsApi = new PostsApi();
  const mockData = {
    userId: postsData.validPost.userId,
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
  };

  beforeAll(async () => {
    await mb.create({
      port: 4545,
      protocol: 'http',
      name: 'jsonplaceholder-proxy-with-post-mock',
      stubs: [
        {
          predicates: [
            {
              equals: {
                method: 'POST',
                path: '/posts',
              },
            },
          ],
          responses: [
            {
              is: {
                statusCode: 201,
                headers: { 'Content-Type': 'application/json' },
                body: {
                  id: 101,
                  ...mockData,
                },
              },
            },
          ],
        },
      ],
      proxy: {
        to: 'https://jsonplaceholder.typicode.com',
        mode: 'proxyAlways',
      },
    });
  });

  test('1. Get all posts', async () => {
    const response = await postsApi.getAllPosts();

    expect(response.status).toBe(200);
    expect(response.data).toBeArray();

    const ids = response.data.map(p => p.id);
    const sortedIds = [...ids].sort((a, b) => a - b);
    expect(ids).toEqual(sortedIds);
  });

  test('2. Get post with valid ID returns correct data', async () => {
    const { validPost2 } = postsData;
    const { status, data } = await postsApi.getPostById(validPost2.id);

    expect(status).toBe(200);
    expect(data).toMatchObject({
      id: validPost2.id,
      userId: validPost2.userId,
      title: expect.any(String),
      body: expect.any(String),
    });
  });
  
  test('3. Get post with invalid ID returns 404', async () => {
    const { invalidPost } = postsData;

    const { status, data } = await postsApi.getPostById(invalidPost.id);

    expect(status).toBe(404);
    expect(data).toBeEmptyObject(); 

  });

  test('4. Create post with userId=1 and random body/title', async () => {
    const requestData = {
      userId: postsData.validPost.userId,
      title: mockData.title,
      body: mockData.body,
    };

    const response = await postsApi.createPost(requestData);

    expect(response.status).toBe(201);
    expect(response.data).toMatchObject({
      id: expect.any(Number),
      title: mockData.title,
      body: mockData.body,
      userId: mockData.userId,
    });
  });

});
