import { Vendor } from './vendor-supplier.model';

export interface VendorState {
  vendor: Vendor[];
  selectedVendor: Vendor | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: VendorState = {
  vendor: [],
  selectedVendor: null,
  isLoading: false,
  error: null,
};
