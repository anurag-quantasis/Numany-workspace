import { TableLazyLoadEvent } from 'primeng/table';
import { Bed } from './beds.model';

export interface BedState {
  beds: Bed[]; // The beds for the *current* page
  totalRecords: number; // Total beds in the database for pagination
  isLoading: boolean;
  error: string | null;
  filter: string; // To hold any search/filter query
  selectedBeds: Bed[]; // Optional: to hold the currently selected bed for details or editing
  lastLazyLoadEvent: TableLazyLoadEvent;
}

export const initialState: BedState = {
  beds: [],
  totalRecords: 0,
  isLoading: false,
  error: null,
  filter: '',
  selectedBeds: [],
  lastLazyLoadEvent: { first: 0, rows: 5 },
};
