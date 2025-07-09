import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, inject } from '@angular/core';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { BedService } from '../services/beds.service';
import { initialState } from './beds.state';
import { Bed, NewBed } from './beds.model';
import { toastSeverity } from '../../../core/utils/tenant.constants'; // Assuming you have this path
import { TableLazyLoadEvent } from 'primeng/table';

export const BedStore = signalStore(
  // 1. Initial State
  withState({ ...initialState, selectedBed: null as Bed | null }),

  // 2. Computed Signals (optional, but good for derived state)
  withComputed(({ beds, totalRecords, selectedBed, lastLazyLoadEvent }) => ({
    bedCount: computed(() => beds().length),
    total: computed(() => totalRecords()),
    isBedSelected: computed(() => selectedBed() !== null),
    first: computed(() => lastLazyLoadEvent().first ?? 0),
  })),

  // 3. Methods
  withMethods((store, bedService = inject(BedService), messageService = inject(MessageService)) => {
    // We'll store the last load event to easily refresh the table
    let lastLazyLoadEvent: TableLazyLoadEvent = { first: 0, rows: 10 };

    // --- DEFINE METHODS AS LOCAL CONSTANTS ---

    const loadBeds = rxMethod<TableLazyLoadEvent>(
      pipe(
        tap((event) =>
          patchState(store, { isLoading: true, error: null, lastLazyLoadEvent: event }),
        ),
        switchMap((event) =>
          bedService.getBeds(event).pipe(
            tap((response) => {
              if (response.status === 'success') {
                const { items, totalRecords } = response.data;
                patchState(store, { beds: items, totalRecords, isLoading: false });
              } else {
                patchState(store, {
                  error: response.error,
                  isLoading: false,
                  beds: [],
                  totalRecords: 0,
                });
                messageService.add({
                  severity: 'error',
                  summary: 'Loading Failed',
                  detail: response.error,
                });
              }
            }),
          ),
        ),
      ),
    );

    const addBed = rxMethod<NewBed>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((newBed) =>
          bedService.addBed(newBed).pipe(
            tap((response) => {
              if (response.status === 'success') {
                messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Bed created successfully.',
                });
                loadBeds(store.lastLazyLoadEvent()); // Reload table on success
              } else {
                patchState(store, { error: response.error, isLoading: false });
                messageService.add({
                  severity: 'error',
                  summary: 'Creation Failed',
                  detail: response.error,
                });
              }
            }),
          ),
        ),
      ),
    );

    const deleteBed = rxMethod<string>( // The ID is now a string
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        // switchMap((bedId) =>
        //   bedService.deleteBed(bedId).pipe(
        //     tap(() => {
        //       messageService.add({
        //         key: 'custom-toast',
        //         severity: toastSeverity.success,
        //         summary: 'Success',
        //         detail: `Bed was deleted successfully`,
        //         life: 3000,
        //       });
        //       // Refresh the table to get the correct data and total record count.
        //       loadBeds(lastLazyLoadEvent);
        //     }),
        //     catchError((err: Error) => {
        //       patchState(store, { error: err.message, isLoading: false });
        //       messageService.add({
        //         key: 'custom-toast',
        //         severity: toastSeverity.error,
        //         summary: 'Deletion Failed',
        //         detail: err.message || 'An unknown error occurred',
        //         life: 3000,
        //       });
        //       return of(null);
        //     }),
        //   ),
        // ),
      ),
    );

    // --- NEW SELECTION METHOD ---

    /** A simple "state writer" to update the selected bed from the UI. */
    const selectBed = (bed: Bed | null) => {
      patchState(store, { selectedBed: bed });
    };

    // 4. NEW METHOD to handle pagination logic
    const paginate = (direction: 'next' | 'previous') => {
      const currentEvent = store.lastLazyLoadEvent();
      const total = store.totalRecords();

      // --- FIX IS HERE ---
      // Use the nullish coalescing operator (??) to provide a default value
      // if 'first' or 'rows' are null/undefined.
      const first = currentEvent.first ?? 0;
      const rows = currentEvent.rows ?? 5; // Default to 5, matching our initial state

      // Now, 'rows' is guaranteed to be a number, and the error is gone.
      if (total <= rows) return;

      let newFirst = first;
      if (direction === 'next' && first + rows < total) {
        newFirst = first + rows;
      } else if (direction === 'previous' && first > 0) {
        newFirst = first - rows;
      }

      if (newFirst !== first) {
        // Trigger a load with the full event context, only updating `first`.
        // This preserves sorting and other parameters.
        loadBeds({ ...currentEvent, first: newFirst });
      }
    };

    // --- RETURN THE METHODS ---
    return { loadBeds, addBed, deleteBed, selectBed, paginate };
  }),
);
