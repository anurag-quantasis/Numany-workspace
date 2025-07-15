export interface AuthState {
  user: {
    username: string | null;
    email: string | null;
    userId: string | null;
  };
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: {
    username: null,
    email: null,
    userId: null,
  },
  token: null,
  isLoading: false,
  error: null,
};
