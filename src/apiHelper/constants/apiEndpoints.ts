export const APIEndpoints = {
  BASE_URL: process.env.BASE_URL,
  USERS: '/api/users',
  LOGIN: '/api/login',
  REGISTER: '/api/register',
  
  getUserById: (id: number | string) => `/api/users/${id}`,
  getUsersPage: (page: number) => `/api/users?page=${page}`,
};