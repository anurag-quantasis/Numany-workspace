// src/app/features/administration-schedules/administration-schedules-store/administration-schedules.model.ts

export interface Schedule {
  id_sced: string;
  if_time: string;
  if_day: string;
  ifixed: number;
  nday: number;
  idesc: string;
  int_val: number;
  int_day: number;
  hide_list: boolean;
  status?: number;
}

export type NewSchedulePayload = Omit<Schedule, 'status'>;

export interface AddScheduleResponse {
  message: string;
  data: Schedule;
}

// NEW: Interface for the paging information
export interface PagingInfo {
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// NEW: Interface for the entire GET /schedules response
export interface ScheduleListResponse {
  data: Schedule[];
  paging: PagingInfo;
}
