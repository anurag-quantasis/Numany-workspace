import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { initialState } from './lab-store.state';
import { inject } from '@angular/core';
import { TenantLabResultService } from '../service/lab-result-type-maintenance.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import {
  TenantLabAddResponse,
  TenantLabResult,
  TenantLabResultPayload,
  TenantLabResultResponse,
  TenantLabResultUpdateResponse,
} from './lab-store.models';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { tenantHandleHttpError } from '../../../shared/utils/tenant-api-error-handler.utils';

export const TenantLabStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      tenantLabResultService = inject(TenantLabResultService),
      messageService = inject(MessageService),
    ) => {
      // --- Method to load all data ---
      const loadTenantLabResults = rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(() =>
            tenantLabResultService.getTenantLabResults().pipe(
              tap((response: TenantLabResultResponse) => {
                // Using the same response handling logic as BedStore
                if (response && response.data) {
                  // Assuming a simple success check if `status` isn't present
                  const tenantLabResultsArray = Array.isArray(response.data) ? response.data : [];
                  patchState(store, {
                    tenantLabResult: tenantLabResultsArray,
                    isLoading: false,
                  });
                } else {
                  const errorMessage = 'Failed to load lab results.';
                  patchState(store, { error: errorMessage, isLoading: false, tenantLabResult: [] });
                  messageService.add({
                    key: 'custom-toast',
                    severity: 'error',
                    summary: 'Loading Failed',
                    detail: errorMessage,
                  });
                }
              }),
            ),
          ),
        ),
      );

      // --- Method to update a single item ---
      const updateTenantLabResult = rxMethod<TenantLabResult>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((labResult) => {
            // Start of switchMap's function body
            const apiPayload = { lab: labResult };
            return tenantLabResultService.updateTenantLabResult(labResult.id_lab, apiPayload).pipe(
              tap((response) => {
                if (response) {
                  messageService.add({
                    key: 'custom-toast',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Lab result updated successfully.',
                  });
                  loadTenantLabResults();
                } else {
                  const errorMessage = 'Update failed.';
                  patchState(store, { error: errorMessage, isLoading: false });
                  messageService.add({
                    key: 'custom-toast',
                    severity: 'error',
                    summary: 'Update Failed',
                    detail: errorMessage,
                  });
                }
              }),
              catchError((err: HttpErrorResponse) => {
                const errorMessage = err.error?.message || err.message || 'Something went Wrong';
                patchState(store, { error: errorMessage, isLoading: false });

                tenantHandleHttpError(err, messageService, 'Update Failed');

                return of(undefined);
              }),
            );
          }),
        ),
      );

      const deleteTenantLabResult = rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((labResultId) =>
            tenantLabResultService.deleteTenantLabResult(labResultId).pipe(
              tap((response) => {
                if (response.isDeleted) {
                  messageService.add({
                    key: 'custom-toast',
                    severity: 'success',
                    summary: 'Success',
                    detail: response.message,
                  });
                  loadTenantLabResults();
                } else {
                  const errorMessage = response?.message || 'Deletion failed.';
                  patchState(store, { error: errorMessage, isLoading: false });
                  messageService.add({
                    key: 'custom-toast',
                    severity: 'error',
                    summary: 'Deletion Failed',
                    detail: errorMessage,
                  });
                }
              }),
              catchError((err: HttpErrorResponse) => {
                const errorMessage = err.error?.message || err.message || 'Something went Wrong';
                patchState(store, { error: errorMessage, isLoading: false });

                tenantHandleHttpError(err, messageService, 'Failed to Add');

                return of(undefined);
              }),
            ),
          ),
        ),
      );

      const addTenantLabResult = rxMethod<any>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((payload) =>
            tenantLabResultService.addTenantLabResult({ lab: payload }).pipe(
              // Handle the successful API response with the CORRECT type
              tap((response: TenantLabAddResponse) => {
                // The success condition is still valid: we check for the presence of the response and data
                if (response && response.data) {
                  messageService.add({
                    key: 'custom-toast',
                    severity: 'success',
                    summary: 'Success',
                    // Use the dynamic message from the API!
                    detail: response.message,
                  });
                  // Reload the data to show the new item
                  loadTenantLabResults();
                } else {
                  const errorMessage = 'Creation failed.';
                  patchState(store, { error: errorMessage, isLoading: false });
                  messageService.add({
                    key: 'custom-toast',
                    severity: 'error',
                    summary: 'Creation Failed',
                    detail: errorMessage,
                  });
                }
              }),
              // Catch HTTP errors (e.g., 400 Bad Request, 500 Server Error)
              catchError((err: HttpErrorResponse) => {
                const errorMessage = err.error?.message || err.message || 'Something went Wrong';
                patchState(store, { error: errorMessage, isLoading: false });

                tenantHandleHttpError(err, messageService, 'Failed to Add');

                return of(undefined);
              }),
            ),
          ),
        ),
      );

      // --- Synchronous method to set the selected item ---
      const setSelection = (labResult: TenantLabResult | null) => {
        patchState(store, { selectedTenantLabResult: labResult });
      };

      // Return the methods so they are part of the store's public API
      return {
        loadTenantLabResults,
        addTenantLabResult,
        updateTenantLabResult,
        deleteTenantLabResult,
        setSelection,
      };
    },
  ),
);
