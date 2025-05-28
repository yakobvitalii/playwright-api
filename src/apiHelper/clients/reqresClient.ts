import { APIRequestContext } from '@playwright/test';
import { BaseClient } from './baseClient';
import { GetUserResponse, GetUsersResponse, UpdateUserResponse, User } from '../models/user';
import { AuthRequest, AuthResponse } from '../models/auth';
import { logInfo, logError } from '../utils/logger';

export class ReqresClient extends BaseClient {
  constructor(request: APIRequestContext) {
    super(request);
  };

  async getUsersPage(page = 1): Promise<GetUsersResponse> {
    const url = `api/users?page=${page}`;
    logInfo(`GET ${url} - Request started`);
    try {
      const response = await this.handle<GetUsersResponse>(this.request.get(url));
      logInfo(`GET ${url} - Request succeeded`);
      return response;
    } catch (error) {
      logError(`GET ${url} - Request failed`, error);
      throw error;
    }
  };

  async getUserId(id: number): Promise<GetUserResponse> {
    const url = `api/users/${id}`;
    logInfo(`GET ${url} - Request started`);
    try {
      const response = await this.handle<GetUserResponse>(this.request.get(url));
      logInfo(`GET ${url} - Request succeeded`);
      return response;
    } catch (error) {
      logError(`GET ${url} - Request failed`, error);
      throw error;
    }
  };

  async createUser(data: User): Promise<User> {
    const url = 'api/users';
    logInfo(`POST ${url} - Request started with data: ${JSON.stringify(data)}`);
    try {
      const response = await this.handle<User>(this.request.post(url, { data }));
      logInfo(`POST ${url} - Request succeeded with response id: ${response.id}`);
      return response;
    } catch (error) {
      logError(`POST ${url} - Request failed`, error);
      throw error;
    }
  };

  async updateUser(id: number, data: User): Promise<UpdateUserResponse> {
    const url = `api/users/${id}`;
    logInfo(`PUT ${url} - Request started with data: ${JSON.stringify(data)}`);
    try {
      const response = await this.handle<UpdateUserResponse>(this.request.put(url, { data }));
      logInfo(`PUT ${url} - Request succeeded with updatedAt: ${response.updatedAt}`);
      return response;
    } catch (error) {
      logError(`PUT ${url} - Request failed`, error);
      throw error;
    }
  };

  async deleteUser(id: number) {
    const url = `api/users/${id}`;
    logInfo(`DELETE ${url} - Request started`);
    try {
      const response = await this.request.delete(url);
      logInfo(`DELETE ${url} - Request succeeded with status: ${response.status()}`);
      return response;
    } catch (error) {
      logError(`DELETE ${url} - Request failed`, error);
      throw error;
    }
  };

  async register(data: AuthRequest): Promise<AuthResponse> {
    const url = 'api/register';
    logInfo(`POST ${url} - Request started with data: ${JSON.stringify(data)}`);
    try {
      const response = await this.handle<AuthResponse>(this.request.post(url, { data }));
      logInfo(`POST ${url} - Request succeeded with id: ${response.id}`);
      return response;
    } catch (error) {
      logError(`POST ${url} - Request failed`, error);
      throw error;
    }
  };

  async login(data: AuthRequest): Promise<AuthResponse> {
    const url = 'api/login';
    logInfo(`POST ${url} - Request started with data: ${JSON.stringify(data)}`);
    try {
      const response = await this.handle<AuthResponse>(this.request.post(url, { data }));
      logInfo(`POST ${url} - Request succeeded with token`);
      return response;
    } catch (error) {
      logError(`POST ${url} - Request failed`, error);
      throw error;
    }
  };
}
