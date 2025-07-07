import { ChargeParameter } from './charge-maintenance.model';

export interface ChargeMaintenanceState {
  records: ChargeParameter[];
  selectedIndex: number;
  isEditMode: boolean;
}

export const initialState: ChargeMaintenanceState = {
  records: [],
  selectedIndex: 0,
  isEditMode: false,
};
