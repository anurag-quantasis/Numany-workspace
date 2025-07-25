import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import {
  Vendor,
  VendorPayload,
  VendorResponse,
} from '../vendor-supplier-store/vendor-supplier.model';

@Injectable({ providedIn: 'root' })
export class VendorSupplierService {
  private vendorServices = inject(ApiService);
  getVendor(): Observable<VendorResponse> {
    return this.vendorServices.get<VendorResponse>('/Vendor');
  }
  addVendor(vendorPayload: VendorPayload): Observable<VendorResponse> {
    return this.vendorServices.post<VendorResponse>(`/Vendor`, vendorPayload);
  }
  updateVendor(id: string, vendorPayload: VendorPayload): Observable<Vendor> {
    return this.vendorServices.put(`/Vendor/${id}`, vendorPayload);
  }
  deleteVendor(id: string): Observable<void> {
    return this.vendorServices.delete(`/Vendor/${id}`);
  }
  getVendorById(id: string): Observable<Vendor[]> {
    return this.vendorServices.get(`/Vendor/${id}`);
  }
}
