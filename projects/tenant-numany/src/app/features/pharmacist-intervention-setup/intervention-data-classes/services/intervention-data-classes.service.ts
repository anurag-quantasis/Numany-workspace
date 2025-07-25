import { inject, Injectable } from '@angular/core';
import { ApiService } from 'projects/tenant-numany/src/app/core/services/api.service';
import { Observable } from 'rxjs';
import {
  InterventionDataClasses,
  InterventionDataClassesPayload,
  InterventionDataClassesResponse,
} from '../intervention-data-classes-store/intervention-data-classes.model';

@Injectable({ providedIn: 'root' })
export class InterventionDataClassesService {
  private apiService = inject(ApiService);

  getInterventionDataClasses(): Observable<InterventionDataClassesResponse> {
    return this.apiService.get<InterventionDataClassesResponse>('/');
  }

  addInterventionDataClasses(
    interventionDataClassesPayload: InterventionDataClassesPayload,
  ): Observable<InterventionDataClassesResponse> {
    return this.apiService.post<InterventionDataClassesResponse>(
      '/',
      interventionDataClassesPayload,
    );
  }
  updateInterventionDataClasses(
    id: string,
    interventionDataClassesPayload: InterventionDataClassesPayload,
  ): Observable<InterventionDataClasses> {
    return this.apiService.put(`/${id}`, interventionDataClassesPayload);
  }
  deleteInterventionDataClasses(id: string): Observable<void> {
    return this.apiService.delete(`/${id}`);
  }
  getInterventionDataClassesById(id: string): Observable<InterventionDataClasses[]> {
    return this.apiService.get<InterventionDataClasses[]>(`/${id}`);
  }
}
