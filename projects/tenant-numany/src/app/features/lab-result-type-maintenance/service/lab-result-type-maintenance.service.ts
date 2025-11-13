import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import {
  TenantLabAddResponse,
  TenantLabDeleteResponse,
  TenantLabResult,
  TenantLabResultPayload,
  TenantLabResultResponse,
} from '../lab-store/lab-store.models';

@Injectable()
export class TenantLabResultService {
  private apiService = inject(ApiService);

  getTenantLabResults(): Observable<TenantLabResultResponse> {
    return this.apiService.get<TenantLabResultResponse>('/labs');
  }

  addTenantLabResult(tenantPayload: TenantLabResultPayload): Observable<TenantLabAddResponse> {
    return this.apiService.post<TenantLabAddResponse>('/lab', tenantPayload);
  }

  updateTenantLabResult(
    id: string,
    tenantLabResultPayload: TenantLabResultPayload,
  ): Observable<TenantLabResult> {
    return this.apiService.put(`/lab/${id}`, tenantLabResultPayload);
  }

  deleteTenantLabResult(id: string): Observable<TenantLabDeleteResponse> {
    return this.apiService.delete(`/lab/${id}`);
  }

  getTenantLabResult(id: string): Observable<TenantLabResult[]> {
    return this.apiService.get(`/labs/${id}`);
  }
}
