import { User, Role } from "../permissions/role";

// The shape of our global authentication state
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}