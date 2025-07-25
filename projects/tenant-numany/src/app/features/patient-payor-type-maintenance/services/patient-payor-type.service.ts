import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import {
  AddPatientPayorResponse,
  PatientPayor,
  PatientPayorPayload,
  PatientPayorResponse,
} from '../patient-payor-type-store/patient-payor-type.model';

@Injectable({ providedIn: 'root' })
export class PatientPayorTypeService {
  private apiService = inject(ApiService);

  getPatient(): Observable<PatientPayorResponse> {
    return this.apiService.get<PatientPayorResponse>('/payors');
  }

  addPatient(patientPayload: PatientPayorPayload): Observable<AddPatientPayorResponse> {
    return this.apiService.post<AddPatientPayorResponse>(`/payor`, patientPayload);
  }

  updatePatient(id: string, patientPayload: PatientPayorPayload): Observable<PatientPayor> {
    return this.apiService.put(`/payor/${id}`, patientPayload);
  }

  deletePatient(id: string): Observable<void> {
    return this.apiService.delete(`/payor/${id}`);
  }

  getPatientById(id: string): Observable<PatientPayor[]> {
    return this.apiService.get<PatientPayor[]>(`/payor/${id}`);
  }
}
