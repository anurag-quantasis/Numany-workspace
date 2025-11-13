import { TableLazyLoadEvent } from 'primeng/table';
import { Bed } from './beds.model';

export interface BedState {
  beds: Bed[];
  totalRecords: number;
  isLoading: boolean;
  error: string | null;
  filter: string;
  selectedBed?: Bed | null;
  lastLazyLoadEvent: TableLazyLoadEvent;
}

export const initialState: BedState = {
  beds: [],
  totalRecords: 0,
  isLoading: false,
  error: null,
  filter: '',
  selectedBed: null,
  lastLazyLoadEvent: { first: 0, rows: 10 },
};
