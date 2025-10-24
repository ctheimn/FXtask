import { PostsApi } from '../src/api/postApi';
import postsData from './testData/postsData.json'; 
import { faker } from '@faker-js/faker';
import { FlexiPredicate, HttpMethod, Imposter, Mountebank, Operator, Proxy, Response, Stub } from '@anev/ts-mountebank';
describe('Posts API', () => {
  const postsApi = new PostsApi();
  let imposter: Imposter;

  const postId = 2873487264;
  const mockData = {
    userId: postsData.validPost2.userId,
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
  };

 /*
* TODO:
* - Skip test 4 for now
* - Check if we can create a post with userID = 123456789 (should respond with postID = 1)
* - Check if we can create a post with userID = 987654321 (should respond with postID = 2)
* - Check if we can create a post with userID = not 123456789 or 987654321 (should respond with postID from real API (proxy))
*/

  beforeAll(async () => {
    const mb = new Mountebank();

    imposter = new Imposter()
      .withPort(4545)
      .withRecordRequests(true)
      .withStub(
        new Stub()
          .withPredicate(
            new FlexiPredicate()
              .withOperator(Operator.equals)
              .withMethod(HttpMethod.POST)
              .withPath("/posts")
              .withBody({userID: postsData.validPost2.userId})
          )
          .withResponse(
            new Response()
              .withStatusCode(201)
              .withBody({
                id: postId,
                ...mockData,
              })
          )
      )
      .withStub(
        new Stub()
        .withPredicate(
          new FlexiPredicate()
          .withOperator(Operator.equals)
          .withMethod(HttpMethod.POST)
          .withPath("/posts")
          .withBody({userId: postsData.mockPost.userId})
        )
        .withResponse(
          new Response()
          .withStatusCode(201)
          .withBody({
            id: postsData.validPost.id,
            ...mockData,
            userId: postsData.mockPost.userId,
          })
        )
      )
      .withStub(
        new Stub()
        .withPredicate(
          new FlexiPredicate()
          .withOperator(Operator.equals)
          .withMethod(HttpMethod.POST)
          .withPath("/posts")
          .withBody({userID: postsData.mockPost2.userId})
        )
        .withResponse(
          new Response()
          .withStatusCode(201)
          .withBody({
            id: postsData.validPost3.id,
            ...mockData,
            userId: postsData.mockPost2.userId,
          })
        )
      )
      .withStub(
        new Stub().withProxy(new Proxy("https://jsonplaceholder.typicode.com"))
      )
      

    await mb.createImposter(imposter);
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
    const response = await postsApi.createPost(mockData);

    expect(response.status).toBe(201);
    expect(response.data).toMatchObject({
      id: postId,
      ...mockData,
    });
  });

  test('5. Create post with custom userId = 123456789 returns id = 1', async () => {
    const response = await postsApi.createPost({
      ...mockData,
      userId: postsData.mockPost.userId,
    });

    expect(response.status).toBe(201);
    expect(response.data).toMatchObject({
      id: postsData.validPost.id,
      ...mockData,
      userId: postsData.mockPost.userId,
    });
  });

  test('6. Create post with custom userId = 987654321 returns id = 2', async () => {
    const response = await postsApi.createPost({
      ...mockData,
      userId: postsData.mockPost2.userId,
    });

    expect(response.status).toBe(201);
    expect(response.data).toMatchObject({
      id: postsData.validPost3.id,
      ...mockData,
      userId: postsData.mockPost2.userId,
    });
  });
  
  test('7. Create post with custom userId != 123456789 or 987654321', async () => {
    const response = await postsApi.createPost({
      ...mockData,
      userId: postsData.mockPost3.userId,
      
    });

    expect(response.status).toBe(201);
    expect(response.data).toMatchObject({
      id: postsData.validPost.id,
      ...mockData,
      userId: postsData.mockPost3.userId,
    });
  });

});
