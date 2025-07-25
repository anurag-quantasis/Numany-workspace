import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { initialState } from './intervention-types.state';
import { InterventionTypesService } from '../services/intervention-types.service';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { InterventionTypes, InterventionTypesResponse } from './intervention-types.model';

export const InterventionTypesStore = signalStore(
  withState(initialState),
  withComputed((store) => ({})),
  withMethods((store, interventionTypesService = inject(InterventionTypesService)) => ({
    loadInterventionTypes: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          interventionTypesService.getInterventionTypes().pipe(
            tap({
              next: (response: InterventionTypesResponse) => {
                const typesArray =
                  response.data && Array.isArray(response.data) ? response.data : [];
                patchState(store, { interventionTypes: typesArray, isLoading: false, error: null });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    addNewInterventionTypes: rxMethod<InterventionTypes>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((types) => {
          const apiPayload = { interventionType: types };

          return interventionTypesService.addInterventionTypes(apiPayload).pipe(
            tap({
              next: (response) => {
                patchState(store, {
                  interventionTypes: [...store.interventionTypes(), response.data],
                  isLoading: false,
                });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          );
        }),
      ),
    ),
    updateInterventionTypes: rxMethod<InterventionTypes>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((types) => {
          const apiPayload = { interventionType: types };
          return interventionTypesService.updateInterventionTypes(types.pi_id, apiPayload).pipe(
            tap({
              next: (updated) => {
                const allTypes = store
                  .interventionTypes()
                  .map((t) => (t.pi_id === updated.pi_id ? updated : t));
                patchState(store, { interventionTypes: allTypes, isLoading: false });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          );
        }),
      ),
    ),
    deleteInterventionTypes: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          interventionTypesService.deleteInterventionTypes(id).pipe(
            tap({
              next: () => {
                patchState(store, {
                  interventionTypes: store.interventionTypes().filter((t) => t.pi_id !== id),
                  isLoading: false,
                });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),
    loadInterventionTypesById: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: false })),
        switchMap((id) =>
          interventionTypesService.getInterventionTypesById(id).pipe(
            tap({
              next: (typesArray) => {
                const foundTypes = typesArray && typesArray.length > 0 ? typesArray[0] : null;
                patchState(store, { selectedInterventionTypes: foundTypes, isLoading: false });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),
  })),
);
