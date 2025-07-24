import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { initialState } from './intervention-data-classes.state';
import { inject } from '@angular/core';
import { InterventionDataClassesService } from '../services/intervention-data-classes.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import {
  InterventionDataClasses,
  InterventionDataClassesResponse,
} from './intervention-data-classes.model';

export const InterventionDataClassesStore = signalStore(
  withState(initialState),
  withComputed((store) => ({})),
  withMethods((store, interventionDataClassesService = inject(InterventionDataClassesService)) => ({
    loadInterventionDataClasses: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          interventionDataClassesService.getInterventionDataClasses().pipe(
            tap({
              next: (response: InterventionDataClassesResponse) => {
                const interventionArray =
                  response.data && Array.isArray(response.data) ? response.data : [];
                patchState(store, {
                  interventionDataCls: interventionArray,
                  isLoading: false,
                  error: null,
                });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    addNewInterventionDataClasses: rxMethod<InterventionDataClasses>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((classes) => {
          const apiPayload = { interventionDataCls: classes };
          return interventionDataClassesService.addInterventionDataClasses(apiPayload).pipe(
            tap({
              next: (response) => {
                patchState(store, {
                  interventionDataCls: [...store.interventionDataCls(), ...response.data],
                  isLoading: false,
                });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          );
        }),
      ),
    ),
    updateInterventionDataClasses: rxMethod<InterventionDataClasses>(
      pipe(
        tap(() => patchState(store, { isLoading: false })),
        switchMap((classes) => {
          const apiPayload = { interventionDataCls: classes };
          return interventionDataClassesService
            .updateInterventionDataClasses(classes.ac_id, apiPayload)
            .pipe(
              tap({
                next: (updated) => {
                  const allClasses = store
                    .interventionDataCls()
                    .map((c) => (c.ac_id === updated.ac_id ? updated : c));
                  patchState(store, { interventionDataCls: allClasses, isLoading: false });
                },
                error: (e) => patchState(store, { error: e.message, isLoading: false }),
              }),
            );
        }),
      ),
    ),

    deleteInterventionDataClasses: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          interventionDataClassesService.deleteInterventionDataClasses(id).pipe(
            tap({
              next: () => {
                patchState(store, {
                  interventionDataCls: store.interventionDataCls().filter((c) => c.ac_id !== id),
                  isLoading: false,
                });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    loadInterventionDataClassesById: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          interventionDataClassesService.getInterventionDataClassesById(id).pipe(
            tap({
              next: (classesArray) => {
                const foundClasses =
                  classesArray && classesArray.length > 0 ? classesArray[0] : null;
                patchState(store, { selectedInterventionDataCls: foundClasses, isLoading: false });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),
  })),
);
