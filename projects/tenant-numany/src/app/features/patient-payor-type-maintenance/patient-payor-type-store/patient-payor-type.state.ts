import { PatientPayor } from './patient-payor-type.model';

export interface PatientPayorState {
  patients: PatientPayor[];
  selectedPatient: PatientPayor | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: PatientPayorState = {
  patients: [],
  selectedPatient: null,
  isLoading: false,
  error: null,
};
