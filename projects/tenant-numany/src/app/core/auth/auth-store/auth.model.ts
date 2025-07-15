export interface LoginRequest {
  user_name?: string;
  password?: string;
}

export interface AuthTokenResponse {
  token: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status?: string;
  errors?: string[];
}

export interface User {
  userId: string;
  username: string;
  email: string;
}
