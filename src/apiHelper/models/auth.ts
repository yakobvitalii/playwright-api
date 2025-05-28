export interface AuthRequest {
  email: string;
  password?: string;
}

export interface AuthResponse {
  id?: number;
  token?: string;
  error?: string;
}