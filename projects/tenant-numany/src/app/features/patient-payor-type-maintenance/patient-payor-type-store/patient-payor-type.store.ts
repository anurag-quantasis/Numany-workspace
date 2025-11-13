import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { initialState } from './patient-payor-type.state';
import { inject } from '@angular/core';
import { PatientPayorTypeService } from '../services/patient-payor-type.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { PatientPayor, PatientPayorResponse } from './patient-payor-type.model';

export const PatientPayorStore = signalStore(
  withState(initialState),
  withComputed((store) => ({})),
  withMethods((store, patienPayorService = inject(PatientPayorTypeService)) => ({
    loadPatientPayor: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          patienPayorService.getPatient().pipe(
            tap({
              next: (response: PatientPayorResponse) => {
                const patientArray =
                  response.data && Array.isArray(response.data) ? response.data : [];
                patchState(store, { patients: patientArray, isLoading: false });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),
    addNewPatient: rxMethod<PatientPayor>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((patient) => {
          const apiPayload = { payor: patient };
          return patienPayorService.addPatient(apiPayload).pipe(
            tap({
              next: (response) => {
                patchState(store, {
                  patients: [...store.patients(), response.data],
                  isLoading: false,
                });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          );
        }),
      ),
    ),
    updatePatient: rxMethod<PatientPayor>(
      pipe(
        tap(() => patchState(store, { isLoading: false })),
        switchMap((patient) => {
          const apiPayload = { payor: patient };
          return patienPayorService.updatePatient(patient.id_pay, apiPayload).pipe(
            tap({
              next: (updated) => {
                const allPatients = store
                  .patients()
                  .map((p) => (p.id_pay === updated.id_pay ? updated : p));
                patchState(store, { patients: allPatients, isLoading: false });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          );
        }),
      ),
    ),
    deletePatient: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: false })),
        switchMap((id) =>
          patienPayorService.deletePatient(id).pipe(
            tap({
              next: () => {
                patchState(store, {
                  patients: store.patients().filter((p) => p.id_pay !== id),
                  isLoading: false,
                });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),
    loadPatientById: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          patienPayorService.getPatientById(id).pipe(
            tap({
              next: (patientArray) => {
                const foundPatient =
                  patientArray && patientArray.length > 0 ? patientArray[0] : null;
                patchState(store, {
                  selectedPatient: foundPatient,
                  isLoading: false,
                });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),
    selectPatient(patient: PatientPayor | null) {
      patchState(store, { selectedPatient: patient });
    },
  })),
);
