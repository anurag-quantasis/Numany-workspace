import { InterventionTypes } from './intervention-types.model';

export interface InterventionTypesState {
  interventionTypes: InterventionTypes[];
  selectedInterventionTypes: InterventionTypes | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: InterventionTypesState = {
  interventionTypes: [],
  selectedInterventionTypes: null,
  isLoading: false,
  error: null,
};
