import axios, { AxiosResponse } from 'axios';
import { User } from '../models/User.js';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export class UsersApi {
  async getUsers(): Promise<AxiosResponse<User[]>> {
    return axios.get(`${BASE_URL}/users`);
  }

  async getUserById(id: number): Promise<AxiosResponse<User>> {
    return axios.get(`${BASE_URL}/users/${id}`);
  }
}
