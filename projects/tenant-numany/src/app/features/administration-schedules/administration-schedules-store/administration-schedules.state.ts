import { Schedule } from './administration-schedules.model';

export interface ScheduleState {
  schedules: Schedule[];
  selectedScheduleId: string | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: ScheduleState = {
  schedules: [],
  selectedScheduleId: null,
  isLoading: false,
  error: null,
};
