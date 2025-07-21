import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { Physician, PhysicianPayload, PhysicianResponse } from '../physician-store/physician.model';

@Injectable({ providedIn: 'root' })
export class PhysicianService {
  private apiService = inject(ApiService);

  getPhysician(): Observable<Physician[]> {
    return this.apiService.get<Physician[]>('/doctors');
  }

  addPhysician(physicianPayload: PhysicianPayload): Observable<PhysicianResponse> {
    return this.apiService.post<PhysicianResponse>('/doctor', physicianPayload);
  }

  updatePhysician(id: string, physicianPayload: PhysicianPayload): Observable<Physician> {
    return this.apiService.put(`/doctor/${id}`, physicianPayload);
  }

  deletePhysician(id: string): Observable<void> {
    return this.apiService.delete(`/doctor/${id}`);
  }

  getPhysicianById(id: string): Observable<Physician[]> {
    return this.apiService.get<Physician[]>(`/doctor/${id}`);
  }
}
