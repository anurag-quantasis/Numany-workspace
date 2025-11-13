import { ChargeParameter, ChargeParameters } from './charge-algorithm.model';

export interface ChargeMaintenanceState {
  records: ChargeParameter[];
  selectedIndex: number;
  isEditMode: boolean;
}
export const initialState = {
  records: [] as ChargeParameters[], // Use the correct interface
  selectedIndex: 0,
  isEditMode: false,
  isLoading: false,
  error: null as string | null,
  totalRecords: 0,
};
