// src/app/core/auth/auth.store.ts

import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { MessageService } from 'primeng/api';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { AuthTokenResponse, LoginRequest, User } from './auth.model';
import { AuthService } from '../auth-service/auth.service';

// 1. DEFINE STATE SHAPE AND INITIAL STATE
// It's a best practice to define interfaces for your state.
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

// 2. CREATE THE SIGNAL STORE
export const AuthStore = signalStore(
  { providedIn: 'root' },

  // --- STATE ---
  withState(initialState),

  // --- COMPUTED SIGNALS (Derived State) ---
  // These are readonly signals that react to state changes automatically.
  withComputed(({ token, user }) => ({
    isAuthenticated: computed(() => !!token()),
    currentUser: computed(() => user()),
    userEmail: computed(() => user()?.email ?? null),
  })),

  // --- METHODS (Actions and Effects) ---
  withMethods(
    (
      store,
      authService = inject(AuthService),
      messageService = inject(MessageService),
      router = inject(Router),
    ) => ({
      // --- ASYNC METHOD (EFFECT) FOR LOGIN ---
      login: rxMethod<LoginRequest>(
        pipe(
          // Step 1: Set loading state and clear previous errors.
          tap(() => patchState(store, { isLoading: true, error: null })),
          // Step 2: Switch to the API call.
          switchMap((credentials) =>
            authService.login(credentials).pipe(
              // Step 3 (Success Path): Process the successful response.
              tap((res: AuthTokenResponse) => {
                if (res && res.token) {
                  const user = authService.decodeJwtToken(res.token);

                  // Robustness Check: Ensure token was valid and decoded.
                  if (!user) {
                    console.error('Failed to decode JWT. Token might be invalid.');
                    patchState(store, {
                      isLoading: false,
                      error: 'Invalid authentication token received.',
                      user: null,
                      token: null,
                    });
                    messageService.add({
                      severity: 'error',
                      summary: 'Login Error',
                      detail: 'Received an invalid token from the server.',
                    });
                    return; // Stop processing
                  }

                  // All good, update the state!
                  patchState(store, {
                    user,
                    token: res.token,
                    isLoading: false,
                    error: null,
                  });

                  localStorage.setItem('authToken', res.token);
                  messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Login Successful',
                  });
                  router.navigate(['/']); // Navigate to home page
                } else {
                  // Handle cases where the API returns 200 OK but no token.
                  patchState(store, {
                    isLoading: false,
                    error: 'Login failed: No token in response.',
                  });
                  messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Login Failed. Please try again.',
                  });
                }
              }),
              // Step 4 (Failure Path): Catch any HTTP errors.
              catchError((err) => {
                const errorMessage = err?.error?.message || 'Invalid credentials or server error.';
                patchState(store, {
                  isLoading: false,
                  error: errorMessage,
                  user: null, // Ensure user/token are cleared on failure
                  token: null,
                });
                messageService.add({
                  severity: 'error',
                  summary: 'Login Error',
                  detail: errorMessage,
                });
                return EMPTY; // Gracefully end the stream for this attempt.
              }),
            ),
          ),
        ),
      ),

      // --- SYNC METHOD FOR LOGOUT ---
      logout(): void {
        patchState(store, initialState); // Reset to the very beginning
        localStorage.removeItem('authToken');
        messageService.add({
          severity: 'info',
          summary: 'Logged Out',
          detail: 'You have been successfully logged out.',
        });
        router.navigate(['/login']);
      },

      // --- SYNC METHOD FOR INITIALIZATION ---
      initializeAuth(): void {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
          const user = authService.decodeJwtToken(storedToken);
          if (user) {
            patchState(store, { token: storedToken, user });
            console.log('Session restored successfully.');
          } else {
            // The stored token is invalid or expired, clear it.
            localStorage.removeItem('authToken');
            console.warn('Removed an invalid token from storage during initialization.');
          }
        }
      },
    }),
  ),
);
