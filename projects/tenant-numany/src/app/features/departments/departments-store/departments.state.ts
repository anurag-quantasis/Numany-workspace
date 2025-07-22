import { Department } from './departments.model';

export interface DepartmentState {
  department: Department[];
  selectedDepartment: Department | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: DepartmentState = {
  department: [],
  selectedDepartment: null,
  isLoading: false,
  error: null,
};
