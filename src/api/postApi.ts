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

  async getPostById(id: number): Promise<AxiosResponse<Post | {}>> {
    return this.api.get<Post | {}>(`/posts/${id}`);
  }

  async createPost(postData: Omit<Post, 'id'>): Promise<AxiosResponse<Post>> {
    return this.api.post<Post>('/posts', postData);
  }
}

