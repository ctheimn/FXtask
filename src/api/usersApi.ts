import axios, { AxiosResponse } from 'axios';
import { User } from '../models/User.js';
import { ApiClient } from './apiClient';


export class UsersApi {
  private api: ApiClient;

  constructor() {
    this.api = new ApiClient();
  }

  async getUsers(): Promise<AxiosResponse<User[]>> {
    return this.api.get<User[]>('/users');
  }

  async getUserById(id: number): Promise<AxiosResponse<User>> {
    return this.api.get<User>(`/users/${id}`);
  }
}
