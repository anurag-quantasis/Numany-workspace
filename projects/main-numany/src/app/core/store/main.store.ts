import { computed, inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { pipe, switchMap, tap } from 'rxjs';
import { MainState, TenantSummary } from './main.type';

const initialState: MainState = {
  tenants: [],
  isLoading: false,
  error: null,
};

export const MainStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  // 4. Computed signals for the admin
  withComputed(({ tenants }) => ({
    totalTenants: computed(() => tenants().length),
  })),

  // 5. Methods for the admin
  withMethods((store, http = inject(HttpClient)) => ({
    loadTenants: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          http.get<TenantSummary[]>('https://api.mainapp.com/admin/tenants').pipe(
            tap({
              next: (tenants) => patchState(store, { tenants, isLoading: false }),
              error: (e) =>
                patchState(store, { error: 'Failed to load tenants', isLoading: false }),
            }),
          ),
        ),
      ),
    ),
  })),
);
