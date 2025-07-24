export interface LoginRequest {
  user_name?: string;
  password?: string;
}

// export interface AuthTokenResponse {
//   token: string;
// }

// export interface ApiResponse<T> {
//   data: T;
//   message: string;
//   status?: string;
//   errors?: string[];
// }

// export interface User {
//   userId: string;
//   username: string;
//   email: string;
// }


// This interface represents the clean user object you'll use in your app's state.
export interface User {
  userId: string;
  email: string;
  roles: string[]; // We'll always store roles as an array for consistency.
}

// This interface represents the raw, decoded JWT payload.
// It includes standard claims (exp, iss, aud) and your custom ones.
export interface DecodedJwtPayload {
  email: string;
  userId: string;
  roles: string | string[]; // The token might send a single role as a string.
  exp: number;
  iss: string;
  aud: string;
}

// Keep these for your store methods
export interface AuthTokenResponse {
  token: string;
}

export interface LoginRequest {
  email?: string;
  password?: string;
}