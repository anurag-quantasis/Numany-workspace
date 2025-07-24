import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { initialState } from './departments.state';
import { inject } from '@angular/core';
import { DepartmentsService } from '../services/departments.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Department, DepartmentResponse } from './departments.model';

export const DepartmentStore = signalStore(
  withState(initialState),
  withComputed((store) => ({})),
  withMethods((store, departmentsService = inject(DepartmentsService)) => ({
    loadDepartments: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          departmentsService.getDepartments().pipe(
            tap({
              next: (response: DepartmentResponse) => {
                const departmentsArray =
                  response.data && Array.isArray(response.data) ? response.data : [];
                patchState(store, { department: departmentsArray, isLoading: false, error: null });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),
    addNewDepartment: rxMethod<Department>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((department) => {
          const apiPayload = { department: department };

          return departmentsService.addDepartment(apiPayload).pipe(
            tap({
              next: (response) => {
                patchState(store, {
                  department: [...store.department(), response.data],
                  isLoading: false,
                });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          );
        }),
      ),
    ),
    updateDepartment: rxMethod<Department>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((department) => {
          const apiPayload = { department: department };
          return departmentsService.updateDepartment(department.id, apiPayload).pipe(
            tap({
              next: (updated) => {
                const allDepartment = store
                  .department()
                  .map((d) => (d.id === updated.id ? updated : d));
                patchState(store, { department: allDepartment, isLoading: false });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          );
        }),
      ),
    ),
    clearSelectedDepartment(): void {
      patchState(store, { selectedDepartment: null });
    },
    deleteDepartment: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          departmentsService.deleteDepartment(id).pipe(
            tap({
              next: () => {
                patchState(store, {
                  department: store.department().filter((d) => d.id !== id),
                  isLoading: false,
                });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),
    loadDepartmentById: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, selectedDepartment: null, error: null })),
        switchMap((id) =>
          departmentsService.getDepartmentById(id).pipe(
            tap({
              next: (departmentArray) => {
                const foundDepartment =
                  departmentArray && departmentArray.length > 0 ? departmentArray[0] : null;
                patchState(store, {
                  selectedDepartment: foundDepartment,
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
