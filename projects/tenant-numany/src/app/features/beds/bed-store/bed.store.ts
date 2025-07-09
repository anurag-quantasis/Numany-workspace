import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, inject } from '@angular/core';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { BedService } from '../services/beds.service';
import { initialState } from './beds.state';
import { Bed, NewBed } from './beds.model';
import { toastSeverity } from '../../../core/utils/tenant.constants';
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
    // let lastLazyLoadEvent: TableLazyLoadEvent = { first: 0, rows: 10 };
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
                  key: 'custom-toast2',
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Bed created successfully.',
                });
                loadBeds(store.lastLazyLoadEvent()); // Reload table on success
              } else {
                patchState(store, { error: response.error, isLoading: false });
                messageService.add({
                  key: 'custom-toast2',
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

    const deleteBed = rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((bedId) =>
          bedService.deleteBed(bedId).pipe(
            tap((response) => {
              console.log('STORE DELETE PART');
              if (response.status === 'success') {
                console.log('response', response);
                messageService.add({
                  key: 'custom-toast2',
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Bed was deleted.',
                });
                loadBeds(store.lastLazyLoadEvent());
              } else {
                patchState(store, { error: response.error, isLoading: false });
                messageService.add({
                  key: 'custom-toast2',
                  severity: 'error',
                  summary: 'Deletion Failed',
                  detail: response.error,
                });
              }
            }),
          ),
        ),
      ),
    );

    const updateBed = rxMethod<Bed>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((bed) =>
          bedService.updateBed(bed).pipe(
            tap((response) => {
              if (response.status === 'success') {
                messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Bed updated successfully.',
                });
                loadBeds(store.lastLazyLoadEvent()); // Reload table on success
              } else {
                patchState(store, { error: response.error, isLoading: false });
                messageService.add({
                  severity: 'error',
                  summary: 'Update Failed',
                  detail: response.error,
                });
              }
            }),
          ),
        ),
      ),
    );

    const setSelection = (bed: Bed | null) => {
      patchState(store, { selectedBed: bed });
    };

    const paginate = (direction: 'next' | 'previous') => {
      const currentEvent = store.lastLazyLoadEvent();
      const total = store.totalRecords();

      const first = currentEvent.first ?? 0;
      const rows = currentEvent.rows ?? 5;

      if (total <= rows) return;

      let newFirst = first;
      if (direction === 'next' && first + rows < total) {
        newFirst = first + rows;
      } else if (direction === 'previous' && first > 0) {
        newFirst = first - rows;
      }

      if (newFirst !== first) {
        loadBeds({ ...currentEvent, first: newFirst });
      }
    };

    return { loadBeds, addBed, deleteBed, updateBed, setSelection, paginate };
  }),
);
