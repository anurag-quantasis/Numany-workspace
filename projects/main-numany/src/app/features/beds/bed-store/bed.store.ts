import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, DestroyRef, inject } from '@angular/core';
import { catchError, of, pipe, switchMap, tap, timer } from 'rxjs';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { BedService } from '../services/beds.service';
import { initialState } from './beds.state';
import { Bed, NewBed } from './beds.model';
import { toastSeverity } from '../../../core/utils/main.constants'; // Assuming you have this path
import { TableLazyLoadEvent } from 'primeng/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
// const REFRESH_INTERVAL_MS = 10000;

export const BedStore = signalStore(
  // 1. Initial State
  withState(initialState),

  // 2. Computed Signals (optional, but good for derived state)
  // 2. Computed Signals
  withComputed(({ beds, totalRecords, selectedBeds, lastLazyLoadEvent }) => ({
    bedCount: computed(() => beds().length),
    total: computed(() => totalRecords()),
    // NEW/UPDATED computed signals for multi-select
    isAnyBedSelected: computed(() => selectedBeds().length > 0),
    selectionCount: computed(() => selectedBeds().length),
    firstSelectedBed: computed(() => selectedBeds()[0] ?? null), // For keyboard navigation
    first: computed(() => lastLazyLoadEvent().first ?? 0),
  })),

  // 3. Methods
  withMethods((store, bedService = inject(BedService), messageService = inject(MessageService)) => {
    // We'll store the last load event to easily refresh the table
    let lastLazyLoadEvent: TableLazyLoadEvent = { first: 0, rows: 10 };

    // --- DEFINE METHODS AS LOCAL CONSTANTS ---

    const loadBeds = rxMethod<TableLazyLoadEvent>(
      pipe(
        // Get the array of selected IDs before the load
        switchMap((event) => {
          const selectedBedIds = store.selectedBeds().map((b) => b.id);
          return of({ event, selectedBedIds });
        }),
        tap(({ event }) => {
          patchState(store, { isLoading: true, error: null, lastLazyLoadEvent: event });
        }),
        switchMap(({ event, selectedBedIds }) =>
          bedService.getBeds(event).pipe(
            tap(({ items, totalRecords }) => {
              // --- SELECTION RECONCILIATION FOR MULTI-SELECT ---
              // Find all previously selected beds that are present in the new data page.
              const reselectedBeds = items.filter((b) => selectedBedIds.includes(b.id));

              patchState(store, {
                beds: items,
                totalRecords,
                isLoading: false,
                // Set the selection to the reconciled list
                selectedBeds: reselectedBeds,
              });
            }),
            catchError((err) => {
              // ... error handling is unchanged ...
              return of(null);
            }),
          ),
        ),
      ),
    );

    const addBed = rxMethod<NewBed>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((newBed) =>
          bedService.addBed(newBed).pipe(
            tap((createdBed) => {
              messageService.add({
                key: 'custom-toast',
                severity: toastSeverity.success,
                summary: 'Success',
                detail: `Bed "${createdBed.name}" was created successfully.`,
                life: 3000,
              });
              // After adding, refresh the current page of the table
              // V-- THIS IS THE FIX --V
              // Call the local 'loadBeds' constant directly.
              loadBeds(lastLazyLoadEvent);
            }),
            catchError((err: Error) => {
              patchState(store, { error: err.message, isLoading: false });
              messageService.add({
                key: 'custom-toast',
                severity: toastSeverity.error,
                summary: 'Creation Failed',
                detail: err.message || 'An unknown error occurred.',
                life: 3000,
              });
              return of(null);
            }),
          ),
        ),
      ),
    );

    const deleteBeds = rxMethod<string[]>( // The ID is now a string
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((bedIds) =>
          bedService.deleteBed(bedIds).pipe(
            tap(() => {
              messageService.add({
                key: 'custom-toast',
                severity: toastSeverity.success,
                summary: 'Success',
                detail: `Bed was deleted successfully`,
                life: 3000,
              });
              // Refresh the table to get the correct data and total record count.
              patchState(store, { selectedBeds: [] });
              loadBeds(lastLazyLoadEvent);
            }),
            catchError((err: Error) => {
              patchState(store, { error: err.message, isLoading: false });
              messageService.add({
                key: 'custom-toast',
                severity: toastSeverity.error,
                summary: 'Deletion Failed',
                detail: err.message || 'An unknown error occurred',
                life: 3000,
              });
              return of(null);
            }),
          ),
        ),
      ),
    );

    // --- NEW SELECTION METHOD ---

    /** A simple "state writer" to update the selected bed from the UI. */
    const setSelection = (beds: Bed[] | null) => {
      patchState(store, { selectedBeds: beds ?? [] });
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
    return { loadBeds, addBed, deleteBeds, setSelection, paginate };
  }),

  // 4. NEW: LIFECYCLE HOOKS for auto-refresh
  withHooks({
    onInit(store, destroyRef = inject(DestroyRef)) {
      // Start a timer that emits after 5 minutes, and then every 5 minutes after that.
      timer(REFRESH_INTERVAL_MS, REFRESH_INTERVAL_MS)
        .pipe(
          // Automatically unsubscribe when the store is destroyed.
          takeUntilDestroyed(destroyRef),
        )
        .subscribe(() => {
          console.log('Auto-refreshing bed data...');
          // Call the loadBeds method, passing the *last used* lazy load event.
          // This ensures we refresh the current page, preserving sorting and filtering.
          store.loadBeds(store.lastLazyLoadEvent());
        });
    },
    // No onDestroy needed thanks to takeUntilDestroyed()
  }),
);
