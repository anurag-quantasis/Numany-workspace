// src/app/features/administration-schedules/services/administration-schedules.service.ts

import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // <-- IMPORTANT: Import map operator
import {
  AddScheduleResponse,
  NewSchedulePayload,
  Schedule,
  ScheduleListResponse, // <-- IMPORTANT: Import the new interface
} from '../administration-schedules-store/administration-schedules.model';

@Injectable({ providedIn: 'root' })
export class AdministrationScheduleService {
  private apiService = inject(ApiService);

  // --- CHANGED: getSchedule ---
  getSchedule(): Observable<Schedule[]> {
    // 1. Expect the full wrapped response from the API.
    return this.apiService.get<ScheduleListResponse>('/schedules').pipe(
      // 2. Use the 'map' operator to transform the response and return only the 'data' array.
      map((response) => response.data || []), // Use || [] as a fallback
    );
  }

  postSchedule(schedulePayload: NewSchedulePayload): Observable<AddScheduleResponse> {
    const body = { schedule: schedulePayload };
    return this.apiService.post<AddScheduleResponse>('/schedule', body);
  }

  getScheduleById(id: string): Observable<Schedule[]> {
    return this.apiService.get<Schedule[]>(`/schedules/${id}`);
  }

  deleteSchedule(id: string): Observable<void> {
    return this.apiService.delete<void>(`/schedule/${id}`);
  }

  updateSchedule(id: string, schedulePayload: Schedule): Observable<Schedule> {
    const body = { schedule: schedulePayload };
    return this.apiService.put<Schedule>(`/schedule/${id}`, body);
  }
}
