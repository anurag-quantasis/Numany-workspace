import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ChargeParameters } from '../charge-algorithm-store/charge-algorithm.model';

interface ApiPaging {
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

interface ApiGetChargeParametersResponse {
  data: ChargeParameters[];
  paging: ApiPaging;
}

interface ApiGetChargeParameterByIdResponse {
  chargeparameter: ChargeParameters;
}

interface ApiMutationResponse {
  chargeparameter?: ChargeParameters;
  isUpdated?: boolean;
  isDelete?: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ChargeAlgorithmService {
  private apiService = inject(ApiService);

  getChargeParameters() {
    return this.apiService.get<ApiGetChargeParametersResponse>('/chargeParameters');
  }

  getChargeParameterById(id: string) {
    return this.apiService.get<ApiGetChargeParameterByIdResponse>(`/chargeParameters/${id}`);
  }

  addChargeParameter(payload: { chargeparameter: ChargeParameters }) {
    return this.apiService.post<ApiMutationResponse>('/chargeParameter', payload);
  }

  updateChargeParameter(id: string, payload: { chargeparameter: ChargeParameters }) {
    return this.apiService.put<ApiMutationResponse>(`/chargeParameters/${id}`, payload);
  }

  deleteChargeParameter(id: string) {
    return this.apiService.delete<ApiMutationResponse>(`/chargeParameters/${id}`);
  }
}
