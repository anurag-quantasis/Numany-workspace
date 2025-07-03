import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { withPermissions } from '../permissions/permissions.utils';
import { AuthState } from './auth.state';
import { MessageService } from 'primeng/api';
import { toastSeverity } from '../../utils/main.constants';

export const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },

  // 1. Define the initial state
  withState(initialState),

  // --- Permission Feature from permission utils ---
  withPermissions(),

  // 2. Define computed signals for derived state
  withComputed(({ token, user }) => ({
    isAuthenticated: computed(() => !!token() && !!user()),
    // You can add more computed signals like `userName`, `userRoles`, etc.
  })),

  // 3. Define methods to update the state and trigger side effects
  withMethods(
    (store, authService = inject(AuthService), messageService = inject(MessageService)) => ({
      // --- ASYNC METHODS (EFFECTS) ---
      login: rxMethod<{ email: string; password: string }>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((credentials) =>
            authService.login(credentials).pipe(
              // This `tap` now ONLY handles the SUCCESS path.
              tap(({ token, user }) => {
                authService.saveToken(token);
                // Set success state and clear any previous error.
                patchState(store, { user, token, isLoading: false, error: null });
              }),

              // `catchError` is the safety net for the FAILURE path.
              catchError((err) => {
                patchState(store, { error: 'Login Failed', isLoading: false });

                messageService.add({
                  key: 'custom-toast',
                  severity: toastSeverity.error,
                  summary: 'Login Failed',
                  detail: 'Please check your credentials.',
                  life: 3000,
                });

                // Return EMPTY. This gracefully ends this inner operation
                // while keeping the main `rxMethod` stream alive for the next attempt.
                return EMPTY;
              }),
            ),
          ),
        ),
      ),

      // This method is for rehydrating state on app load
      hydrateUser: rxMethod<void>(
        pipe(
          // We don't set loading state here, it's a silent background process
          switchMap(() =>
            authService.getUserProfile().pipe(
              tap({
                next: (user) => patchState(store, { user }),
                error: () => {
                  // If fetching user fails, clear the token and log out
                  authService.removeToken();
                  patchState(store, { user: null, token: null });
                },
              }),
            ),
          ),
        ),
      ),

      // --- SYNC METHODS ---
      logout(): void {
        authService.removeToken();
        // Reset the state to its initial values
        patchState(store, initialState);
      },
    }),
  ),

  // 4. LifeCycle hooks
  withHooks({
    onInit({ hydrateUser, ...store }, authService = inject(AuthService)) {
      const initialToken = authService.getToken();
      if (initialToken) {
        patchState(store, { token: initialToken });
        // If a token exists, try to fetch the user profile to re-establish the session
        hydrateUser();
      }
    },
  }),
);
