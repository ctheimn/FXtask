import { PostsApi } from '../src/api/postApi';
import postsData from './testData/postsData.json' 
import { faker } from '@faker-js/faker';
import 'jest-extended';
declare const allure: any;

describe('Posts API', () => {
  const postsApi = new PostsApi();

  test('1. Get all posts', async () => {
  await allure.step('Send GET /posts', async () => {
  const response = await postsApi.getAllPosts();

  expect(response.status).toBe(200);

  expect(response.headers['content-type']).toMatch(/application\/json/);
  
  expect(response.data).toBeArray();
  expect(response.data).not.toBeEmpty();

  const ids = response.data.map(p => p.id);
  const sortedIds = [...ids].sort((a, b) => a - b);
  await allure.step('Verify IDs are sorted', async () => {
    expect(ids).toEqual(sortedIds);
    });
  });
});

  test('2. Get post with valid ID returns correct data', async () => {
    const { validPost } = postsData;
    allure.parameter('Post ID', validPost.id);
    
    await allure.step(`Send GET /posts/${validPost.id}`, async () => {
    const { status, data } = await postsApi.getPostById(validPost.id);

    expect(status).toBe(200);
    expect(data).toMatchObject({
      id: validPost.id,
      userId: validPost.userId,
    });
    await allure.step('Verify title and body are not empty', async () => {
      expect(data).toHaveProperty('title', expect.stringMatching(/\S/));
      expect(data).toHaveProperty('body', expect.stringMatching(/\S/));
    });
    });
  });
  
  test('3. Get post with invalid ID returns 404', async () => {
    const { invalidPost } = postsData;
    allure.parameter('Invalid Post ID', invalidPost.id);

    await allure.step(`Send GET /posts/${invalidPost.id}`, async () => {
    const { status, data } = await postsApi.getPostById(invalidPost.id);

    expect(status).toBe(404);
    expect(data).toBeEmptyObject(); 
    });
  });

  test('4. Create post with userId=1 and random body/title', async () => {
    const requestData = {
      userId: postsData.validPost.userId,
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
    };
    allure.parameter('Request Body', JSON.stringify(requestData));

    await allure.step('Send POST /posts', async () => {
    const response = await postsApi.createPost(requestData);

    expect(response.status).toBe(201);
    expect(response.data).toMatchObject({
      title: requestData.title,
      body: requestData.body,
      userId: requestData.userId,
    });
    expect(response.data).toHaveProperty('id');
  });
  });

});
