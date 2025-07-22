import { Physician } from './physician.model';

export interface PhysicianState {
  physician: Physician[];
  selectedPhysician: Physician | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: PhysicianState = {
  physician: [],
  selectedPhysician: null,
  isLoading: false,
  error: null,
};
