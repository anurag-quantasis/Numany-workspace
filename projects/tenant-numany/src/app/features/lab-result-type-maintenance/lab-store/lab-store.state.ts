import { TenantLabResult } from './lab-store.models';

export interface TenantLabResultState {
  tenantLabResult: TenantLabResult[];
  selectedTenantLabResult: TenantLabResult | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: TenantLabResultState = {
  tenantLabResult: [],
  selectedTenantLabResult: null,
  isLoading: false,
  error: null,
};
