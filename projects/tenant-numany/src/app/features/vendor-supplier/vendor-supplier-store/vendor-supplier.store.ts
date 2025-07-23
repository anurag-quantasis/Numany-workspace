import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { initialState } from './vendor-supplier.state';
import { inject } from '@angular/core';
import { VendorSupplierService } from '../services/vendor-supplier.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Vendor, VendorResponse } from './vendor-supplier.model';

export const VendorStore = signalStore(
  withState(initialState),
  withMethods((store) => ({})),
  withMethods((store, vendorService = inject(VendorSupplierService)) => ({
    loadVendor: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          vendorService.getVendor().pipe(
            tap({
              next: (response: VendorResponse) => {
                const vendorArray =
                  response.data && Array.isArray(response.data) ? response.data : [];
                patchState(store, { vendor: vendorArray, isLoading: false, error: null });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),
    addVendor: rxMethod<Vendor>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((vendor) => {
          const apiPayload = { vendor: vendor };
          return vendorService.addVendor(apiPayload).pipe(
            tap({
              next: (response) => {
                patchState(store, {
                  vendor: [...store.vendor(), ...response.data],
                  isLoading: false,
                });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          );
        }),
      ),
    ),
    updateVendor: rxMethod<Vendor>(
      pipe(
        tap(() => patchState(store, { isLoading: false })),
        switchMap((vendor) => {
          const apiPayload = { vendor: vendor };
          return vendorService.updateVendor(vendor.id_vend, apiPayload).pipe(
            tap({
              next: (updated) => {
                const allVendors = store
                  .vendor()
                  .map((v) => (v.id_vend === updated.id_vend ? updated : v));
                patchState(store, { vendor: allVendors, isLoading: false });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          );
        }),
      ),
    ),
    deleteVendor: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          vendorService.deleteVendor(id).pipe(
            tap({
              next: () => {
                patchState(store, {
                  vendor: store.vendor().filter((d) => d.id_vend !== id),
                  isLoading: false,
                });
              },
              error: (e) => patchState(store, { error: e.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),
    loadVendorById: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, selectedVendor: null })),
        switchMap((id) =>
          vendorService.getVendorById(id).pipe(
            tap({
              next: (vendorArray) => {
                const foundVendor = vendorArray && vendorArray.length > 0 ? vendorArray[0] : null;
                patchState(store, {
                  selectedVendor: foundVendor,
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
