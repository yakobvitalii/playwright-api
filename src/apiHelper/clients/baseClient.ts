import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseClient {
  constructor(protected request: APIRequestContext) {}

  protected async handle<T>(promise: Promise<APIResponse>): Promise<T> {
    const response = await promise;
    if (!response.ok()) {
      const error = await response.text();
      throw new Error(`Request failed: ${response.status()} - ${error}`);
    }
    const data = await response.json();
    return data as T;
  }
}