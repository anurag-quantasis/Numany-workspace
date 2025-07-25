import { InterventionDataClasses } from './intervention-data-classes.model';

export interface InterventionDataClassesState {
  interventionDataCls: InterventionDataClasses[];
  selectedInterventionDataCls: InterventionDataClasses | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: InterventionDataClassesState = {
  interventionDataCls: [],
  selectedInterventionDataCls: null,
  isLoading: false,
  error: null,
};
