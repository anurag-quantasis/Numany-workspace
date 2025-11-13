import { inject, Injectable } from '@angular/core';
import { ApiService } from 'projects/tenant-numany/src/app/core/services/api.service';
import { Observable } from 'rxjs';
import {
  AddInterventionDataClassesResponse,
  InterventionDataClasses,
  InterventionDataClassesPayload,
  InterventionDataClassesResponse,
} from '../intervention-data-classes-store/intervention-data-classes.model';

@Injectable({ providedIn: 'root' })
export class InterventionDataClassesService {
  private apiService = inject(ApiService);

  getInterventionDataClasses(): Observable<InterventionDataClassesResponse> {
    return this.apiService.get<InterventionDataClassesResponse>('/InterventionDataCls');
  }

  addInterventionDataClasses(
    interventionDataClassesPayload: InterventionDataClassesPayload,
  ): Observable<AddInterventionDataClassesResponse> {
    return this.apiService.post<AddInterventionDataClassesResponse>(
      '/InterventionDataCls',
      interventionDataClassesPayload,
    );
  }
  updateInterventionDataClasses(
    id: string,
    interventionDataClassesPayload: InterventionDataClassesPayload,
  ): Observable<InterventionDataClasses> {
    return this.apiService.put(`/InterventionDataCls/${id}`, interventionDataClassesPayload);
  }
  deleteInterventionDataClasses(id: string): Observable<void> {
    return this.apiService.delete(`/InterventionDataCls/${id}`);
  }
  getInterventionDataClassesById(id: string): Observable<InterventionDataClasses[]> {
    return this.apiService.get<InterventionDataClasses[]>(`/InterventionDataCls/${id}`);
  }
}
