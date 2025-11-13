// src/app/features/administration-schedules/administration-schedules-store/administration-schedules.store.ts

import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { initialState, ScheduleState } from './administration-schedules.state';
import { computed, inject } from '@angular/core';
import { AdministrationScheduleService } from '../services/administration-schedules.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
// FIX: Import AddScheduleResponse
import {
  NewSchedulePayload,
  Schedule,
  AddScheduleResponse,
} from './administration-schedules.model';

export const AdministrationScheduleStore = signalStore(
  withState(initialState),

  withComputed((store) => ({
    selectedSchedule: computed(() => {
      const schedules = store.schedules();
      const selectedId = store.selectedScheduleId();
      if (!Array.isArray(schedules)) return null;
      return schedules.find((s) => s.id_sced === selectedId) ?? null;
    }),
  })),

  withMethods((store, scheduleService = inject(AdministrationScheduleService)) => ({
    loadSchedules: rxMethod<void>(
      // ... this method is correct, no changes needed ...
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          scheduleService.getSchedule().pipe(
            tap({
              next: (schedules) => {
                const safeSchedules = Array.isArray(schedules) ? schedules : [];
                patchState(store, { schedules: safeSchedules, isLoading: false });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    addSchedule: rxMethod<NewSchedulePayload>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        // FIX: Pass the payload directly to the service. The service now handles the wrapping.
        switchMap((payload) =>
          scheduleService.postSchedule(payload).pipe(
            tap({
              // This part is now correct because the service returns AddScheduleResponse
              next: (response: AddScheduleResponse) => {
                const newSchedule = response.data; // Extract the schedule from the 'data' property
                patchState(store, {
                  schedules: [...store.schedules(), newSchedule],
                  isLoading: false,
                  selectedScheduleId: newSchedule.id_sced,
                });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    updateSchedule: rxMethod<Schedule>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        // FIX: Pass the payload directly to the service. The service handles wrapping.
        switchMap((payload) =>
          scheduleService.updateSchedule(payload.id_sced, payload).pipe(
            tap({
              next: (updated) => {
                const allSchedules = store
                  .schedules()
                  .map((s) => (s.id_sced === updated.id_sced ? updated : s));
                patchState(store, {
                  schedules: allSchedules,
                  isLoading: false,
                });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    deleteSchedule: rxMethod<string>(
      // ... this method is correct, no changes needed ...
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((id) =>
          scheduleService.deleteSchedule(id).pipe(
            tap({
              next: () => {
                patchState(store, {
                  schedules: store.schedules().filter((s) => s.id_sced !== id),
                  selectedScheduleId:
                    store.selectedScheduleId() === id ? null : store.selectedScheduleId(),
                  isLoading: false,
                });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    selectSchedule(id: string | null): void {
      patchState(store, { selectedScheduleId: id });
    },
  })),
);
