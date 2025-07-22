import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { NewTenant, Tenant } from "./tenant.model";
import { inject } from "@angular/core";
import { TenantPageService } from "../service/tenant.service";
import { MessageService } from "primeng/api";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { TableLazyLoadEvent } from "primeng/table";
import { switchMap, tap,pipe } from "rxjs";

export interface TenantsState {
  tenants: Tenant[];
  isLoading: boolean;
  error: string | null;
  lastLazyLoadEvent: TableLazyLoadEvent;
}

// export const initialState: TenantsState = {
//   tenants: [],
//   isLoading: false,
//   error: null,
//   lastLazyLoadEvent: { first: 0, rows: 10 },
// }

export const initialState:TenantsState = {
  tenants: [],
  isLoading: false,
  error: null,
  // totalRecords: 0,
  lastLazyLoadEvent: { first: 0, rows: 10 },
};

export const TenantStore = signalStore(
  withState(initialState),

  withMethods((store, tenantService = inject(TenantPageService), messageService = inject(MessageService)) => {
    // let lastLazyLoadEvent: TableLazyLoadEvent = { first: 0, rows: 10 };
    const loadTenants = rxMethod<TableLazyLoadEvent>(
      pipe(
        tap((event:any) =>
          patchState(store, { isLoading: true, error: null, lastLazyLoadEvent: event }),
        ),
        switchMap((event:any) =>
          tenantService.getTenants(event).pipe(
            tap((response) => {
              if (response.status === 'success') {
                const { items, totalRecords } = response.data;
                patchState(store, { tenants: items, isLoading: false });
              } else {
                patchState(store, {
                  error: "response.error",
                  isLoading: false,
                  tenants: [],
                  // totalRecords: 0,
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

    const addTenant = rxMethod<NewTenant>(
      pipe(
        tap(() => patchState(store, {isLoading: true, error: null})),
        switchMap((newTenant) => tenantService.addTenant(newTenant).pipe(
          tap((response) => {
            if(response.status === 'success') {
              messageService.add({
                key: 'custom-toast',
                severity: 'success',
                summary: 'Success',
                detail: 'Tenant created successfully.',
              });
              loadTenants(store.lastLazyLoadEvent());
            } else {
              patchState(store, { error: response.error, isLoading: false });
              messageService.add({
                key: 'custom-toast',
                severity: 'error',
                summary: 'Creation Failed',
                detail: response.error,
              });
            }
          })
        ))
      )
    )

    // return { loadBeds, deleteBed, setSelection, paginate };
    return { loadTenants, addTenant };
  }),
)
