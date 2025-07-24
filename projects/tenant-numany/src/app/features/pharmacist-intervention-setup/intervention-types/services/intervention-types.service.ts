import { inject, Injectable } from '@angular/core';
import { ApiService } from 'projects/tenant-numany/src/app/core/services/api.service';
import { Observable } from 'rxjs';
import {
  AddInterventionTypesResponse,
  InterventionTypes,
  InterventionTypesPayload,
  InterventionTypesResponse,
} from '../intervention-types-store/intervention-types.model';

@Injectable({ providedIn: 'root' })
export class InterventionTypesService {
  private apiService = inject(ApiService);

  getInterventionTypes(): Observable<InterventionTypesResponse> {
    return this.apiService.get<InterventionTypesResponse>('/interventionTypes');
  }

  addInterventionTypes(
    interventionTypesPayload: InterventionTypesPayload,
  ): Observable<AddInterventionTypesResponse> {
    return this.apiService.post<AddInterventionTypesResponse>(
      '/interventionType',
      interventionTypesPayload,
    );
  }

  updateInterventionTypes(
    id: string,
    interventionTypesPayload: InterventionTypesPayload,
  ): Observable<InterventionTypes> {
    return this.apiService.put(`/interventionType/${id}`, interventionTypesPayload);
  }

  deleteInterventionTypes(id: string): Observable<void> {
    return this.apiService.delete(`/interventionType/${id}`);
  }

  getInterventionTypesById(id: string): Observable<InterventionTypes[]> {
    return this.apiService.get(`/interventionType/${id}`);
  }
}
