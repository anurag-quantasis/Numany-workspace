import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import {
  PatientPayor,
  PatientPayorResponse,
} from '../patient-payor-type-store/patient-payor-type.model';

@Injectable({ providedIn: 'root' })
export class PatientPayorTypeService {
  private apiService = inject(ApiService);

  getPatient(): Observable<PatientPayor> {
    return this.apiService.get('/payors');
  }

  addPatient(patientPayload: PatientPayor): Observable<PatientPayorResponse> {
    return this.apiService.post<PatientPayorResponse>(`/payor`, patientPayload);
  }

  updatePatient(id: string, patientPayload: PatientPayor): Observable<PatientPayor> {
    return this.apiService.put(`/payor/${id}`, patientPayload);
  }

  deletePatient(id: string): Observable<void> {
    return this.apiService.delete(`/payor/${id}`);
  }

  getPatientById(id: string): Observable<PatientPayor[]> {
    return this.apiService.get<PatientPayor[]>(`/payor/${id}`);
  }
}
