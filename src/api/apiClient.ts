import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { BASE_URL } from '../config';

interface AllureReporter {
  step<T>(name: string, stepFunction: () => Promise<T>): Promise<T>;
  attachment(name: string, content: string, type: string): void;
}

declare const allure: AllureReporter;


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

  private async runWithAllureStep<T>(
    method: string,
    endpoint: string,
    action: () => Promise<AxiosResponse<T>>,
    requestBody?: unknown
  ): Promise<AxiosResponse<T>> {
    return allure.step(`${method.toUpperCase()} ${endpoint}`, async () => {
      if (requestBody) {
        allure.attachment('Request Body', JSON.stringify(requestBody, null, 2), 'application/json');
      }

      const response = await action();

      allure.attachment('Response Body', JSON.stringify(response.data, null, 2), 'application/json');
      allure.attachment('Status Code', response.status.toString(), 'text/plain');

      return response;
    });
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.runWithAllureStep('GET', endpoint, () => this.client.get(endpoint, config));
  }

  async post<T>(endpoint: string, data: object, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.runWithAllureStep('POST', endpoint, () => this.client.post(endpoint, data, config), data);
  }

  async put<T>(endpoint: string, data: object, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.runWithAllureStep('PUT', endpoint, () => this.client.put(endpoint, data, config), data);
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.runWithAllureStep('DELETE', endpoint, () => this.client.delete(endpoint, config));
  }
}
