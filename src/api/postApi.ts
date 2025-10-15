import { ApiClient } from './apiClient'
import { Post } from '../models/Post'
import { AxiosResponse } from 'axios'

export class PostsApi {
  private api: ApiClient;

  constructor() {
    this.api = new ApiClient();
  }


  async getAllPosts(): Promise<AxiosResponse<Post[]>> {
  return this.api.get<Post[]>('/posts');
}

  // async getAllPosts(): Promise<Post[]> {
  //   const response = await this.api.get<Post[]>('/posts');
  //   return response.data.map(Post.fromJson);
  // }

  async getPostById(id: number): Promise<{ status: number; data: Post | {} }> {
    const response = await this.api.get<Post | {}>(`/posts/${id}`, {
      validateStatus: () => true,
    });

    return {
      status: response.status,
      data: response.data,
    };
  }

  async createPost(postData: Omit<Post, 'id'>): Promise<AxiosResponse<Post>> {
    return this.api.post<Post>('/posts', postData);
  }
}

