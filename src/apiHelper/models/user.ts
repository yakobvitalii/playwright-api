export interface User {
  id?: string;
  name: string;
  job: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface GetUsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: UserData[];
}

export interface GetUserResponse {
  data: UserData;
}

export interface UpdateUserResponse {
  name: string;
  job: string;
  updatedAt: string;
}

export interface UpdateUserResponse {
  updatedAt: string;
}

export interface DeleteUserResponse {
  status: number;
}

export interface UserCreationResponse {
  id: string;
  name?: string;
  job?: string;
  createdAt: string;
}

export interface PaginatedUsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: unknown[];
}

export interface LoginResponse {
  token?: string;
  password?: string;
}