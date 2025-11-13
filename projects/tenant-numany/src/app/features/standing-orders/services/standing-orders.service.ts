import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StandingOrdersService {
  private apiService = inject(ApiService);

  getStandingOrders() {
    return this.apiService.get('/');
  }

  addStandingOrders(standingOrdersPayload: any) {
    return this.apiService.post('/', standingOrdersPayload);
  }

  updateStandingOrders(id: string, standingOrdersPayload: any) {
    return this.apiService.put(`/${id}`, standingOrdersPayload);
  }

  deleteStandingOrders(id: string): Observable<void> {
    return this.apiService.delete(`/${id}`);
  }

  getStandingOrdersById(id: string) {
    return this.apiService.get(`/${id}`);
  }
}
