import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import {
  Department,
  DepartmentPayload,
  DepartmentResponse,
} from '../departments-store/departments.model';

@Injectable({ providedIn: 'root' })
export class DepartmentsService {
  private apiService = inject(ApiService);

  getDepartments(): Observable<DepartmentResponse> {
    return this.apiService.get<DepartmentResponse>('/departments');
  }

  addDepartment(departmentPayload: DepartmentPayload): Observable<any> {
    return this.apiService.post<any>('/department', departmentPayload);
  }

  updateDepartment(id: string, departmentPayload: DepartmentPayload): Observable<Department> {
    return this.apiService.put(`/department/${id}`, departmentPayload);
  }

  deleteDepartment(id: string): Observable<void> {
    return this.apiService.delete(`/department/${id}`);
  }

  getDepartmentById(id: string): Observable<Department[]> {
    return this.apiService.get(`/department/${id}`);
  }
}
