import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { BASE_URL } from '../config'

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseUrl: string = BASE_URL) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true
    });
  }

  async get<T>(endpoint: string, params?: object): Promise<AxiosResponse<T>> {
    return this.client.get(endpoint, { params });
  }

  async post<T>(endpoint: string, data: object): Promise<AxiosResponse<T>> {
    return this.client.post(endpoint, data);
  }

  async put<T>(endpoint: string, data: object): Promise<AxiosResponse<T>> {
    return this.client.put(endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<AxiosResponse<T>> {
    return this.client.delete(endpoint);
  }
}
