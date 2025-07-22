import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { initialState } from './physician.state';
import { inject } from '@angular/core';
import { PhysicianService } from '../services/physician.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Physician, PhysicianResponse } from './physician.model';

export const PhysicianStore = signalStore(
  withState(initialState),
  withComputed((store) => ({})),

  withMethods((store, physicianService = inject(PhysicianService)) => ({
    loadPhysician: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          // The service now correctly returns an Observable<PhysicianApiResponse>
          physicianService.getPhysician().pipe(
            tap({
              // The 'response' parameter is now correctly typed
              next: (response: PhysicianResponse) => {
                // FIX: Extract the 'data' array from the response object
                const physiciansArray =
                  response.data && Array.isArray(response.data) ? response.data : [];
                patchState(store, { physician: physiciansArray, isLoading: false, error: null });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    addNewPhysician: rxMethod<Physician>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((physician) => {
          // The incoming data from the component is a 'Physician' object
          // MODIFICATION: Create the API-specific payload structure here
          const apiPayload = { doctor: physician };

          return physicianService.addPhysician(apiPayload).pipe(
            tap({
              next: (response) => {
                patchState(store, {
                  // Assuming response.data is the correct path to the new physician array
                  physician: [...store.physician(), ...response.data],
                  isLoading: false,
                });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          );
        }),
      ),
    ),

    // --- MODIFIED METHOD ---
    updatePhysician: rxMethod<Physician>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((physician) => {
          // The incoming data is a 'Physician' object
          // MODIFICATION: Create the API-specific payload structure here
          const apiPayload = { doctor: physician };

          return physicianService.updatePhysician(physician.id_doc, apiPayload).pipe(
            tap({
              next: (updated) => {
                const allPhysician = store
                  .physician()
                  .map((p) => (p.id_doc === updated.id_doc ? updated : p));
                patchState(store, { physician: allPhysician, isLoading: false });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          );
        }),
      ),
    ),
    deletePhysician: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          physicianService.deletePhysician(id).pipe(
            tap({
              next: () => {
                patchState(store, {
                  physician: store.physician().filter((s) => s.id_doc !== id),
                  isLoading: false,
                });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),
    loadPhysicianById: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, selectedPhysician: null, error: null })),
        switchMap((id) =>
          physicianService.getPhysicianById(id).pipe(
            tap({
              next: (physicianArray) => {
                const foundPhysician =
                  physicianArray && physicianArray.length > 0 ? physicianArray[0] : null;
                patchState(store, {
                  selectedPhysician: foundPhysician,
                  isLoading: false,
                });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),
  })),
);
