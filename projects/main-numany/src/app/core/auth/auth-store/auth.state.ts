import { Role } from "../permissions/role";

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  tenantId: string | null;
}

// The shape of our global authentication state
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}