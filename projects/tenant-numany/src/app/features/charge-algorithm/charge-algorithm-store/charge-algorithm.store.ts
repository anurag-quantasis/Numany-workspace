import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, inject } from '@angular/core';
import { ChargeAlgorithmService } from '../services/charge-algorithm.service';
import { initialState } from './charge-algorithm.state';
import { ChargeParameters } from './charge-algorithm.model';
import { MessageService } from 'primeng/api';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';

export const ChargeMaintenanceStore = signalStore(
  withState({ ...initialState }),

  withComputed(({ records, selectedIndex }) => ({
    currentRecord: computed(() =>
      records()[selectedIndex()] ? structuredClone(records()[selectedIndex()]) : null,
    ),
  })),

  withMethods(
    (store, service = inject(ChargeAlgorithmService), messageService = inject(MessageService)) => {
      // Load all charge parameters
      const loadChargeParameters = rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(() =>
            service.getChargeParameters().pipe(
              tap((res) => {
                patchState(store, {
                  records: res.data,
                  isLoading: false,
                  totalRecords: res.paging.totalItems,
                });
              }),
              catchError((err) => {
                patchState(store, { isLoading: false, error: 'Failed to load charge parameters' });
                messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to load charge parameters',
                });
                return of(null);
              }),
            ),
          ),
        ),
      );

      // Add a new charge parameter
      const addChargeParameter = rxMethod<ChargeParameters>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((payload) =>
            service.addChargeParameter({ chargeparameter: payload }).pipe(
              tap((res) => {
                messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: res.message,
                });
                loadChargeParameters();
              }),
              catchError((err) => {
                patchState(store, { isLoading: false, error: 'Failed to add charge parameter' });
                messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to add charge parameter',
                });
                return of(null);
              }),
            ),
          ),
        ),
      );

      // Update a charge parameter
      const updateChargeParameter = rxMethod<{ id: string; data: ChargeParameters }>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(({ id, data }) =>
            service.updateChargeParameter(id, { chargeparameter: data }).pipe(
              tap((res) => {
                messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: res.message,
                });
                loadChargeParameters();
              }),
              catchError((err) => {
                patchState(store, { isLoading: false, error: 'Failed to update charge parameter' });
                messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to update charge parameter',
                });
                return of(null);
              }),
            ),
          ),
        ),
      );

      // Delete a charge parameter
      const deleteChargeParameter = rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((id) =>
            service.deleteChargeParameter(id).pipe(
              tap((res) => {
                messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: res.message,
                });
                loadChargeParameters();
              }),
              catchError((err) => {
                patchState(store, { isLoading: false, error: 'Failed to delete charge parameter' });
                messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to delete charge parameter',
                });
                return of(null);
              }),
            ),
          ),
        ),
      );

      // Select a record by index
      const selectRecord = (index: number) => {
        patchState(store, { selectedIndex: index });
      };

      return {
        loadChargeParameters,
        addChargeParameter,
        updateChargeParameter,
        deleteChargeParameter,
        selectRecord,
      };
    },
  ),
);
