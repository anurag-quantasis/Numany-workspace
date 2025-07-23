import { inject, Injectable } from '@angular/core';
import { MainApiService } from '../../../core/services/api.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { createHttpParams } from 'shared-ui';
import { ApiResponse, NewTenant, Tenant } from '../tenant-store/tenant.model';

interface ApiMutationResponse {
  data: Tenant | null;
  message: string | null;
}

@Injectable({ providedIn: 'root' })
export class TenantPageService {
  private apiService = inject(MainApiService);
  private readonly tenantsEndpoint = 'https://localhost:8001/api/Tenants';

  getTenants(event: TableLazyLoadEvent) {
    const params = createHttpParams(event);

    return this.apiService.get(this.tenantsEndpoint, { params }).pipe(
      map((apiResponse: any) => {
        const paginatedData = {
          items: apiResponse.tenants,
          totalRecords: 100,
        };

        return { status: 'success', data: paginatedData } as const;
      }),
      catchError((err: HttpErrorResponse) => {
        const message = 'Could not connect to the server. Please try again later.';
        return of({ status: 'error', error: message } as const);
      }),
    );
  }

  addTenant(newTenant: NewTenant): Observable<ApiResponse<Tenant>> {
    const apiPayload = {
      tenant: {
        address: newTenant.address,
        description: newTenant.description,
        emailId: newTenant.emailId,
        expiryDate: newTenant.expiryDate,
        name: newTenant.name,
        password: newTenant.password,
      },
    };

    return this.apiService.post<ApiMutationResponse>(this.tenantsEndpoint, apiPayload).pipe(
      map((apiResponse) => {
        // 2. Check for business logic errors from the API.
        if (!apiResponse.data) {
          return {
            status: 'error',
            error: apiResponse.message || 'An unknown error occurred.',
          } as const;
        }
        return { status: 'success', data: apiResponse.data } as const;
      }),
      catchError((err: HttpErrorResponse) => {
        const message = err.error?.message || 'The request failed.';
        return of({ status: 'error', error: message } as const);
      }),
    );
  }

  updateTenant(tenantToUpdate: Tenant): Observable<ApiResponse<Tenant>> {
    const apiPayload = {
      tenant: {
        ...tenantToUpdate,
      },
    };

    return this.apiService
      .put<ApiMutationResponse>(`this.tenantsEndpoint/${tenantToUpdate.id}`, apiPayload)
      .pipe(
        map((apiResponse) => {
          if (!apiResponse.data) {
            return {
              status: 'error',
              error: apiResponse.message || 'An unknown error occurred.',
            } as const;
          }
          return { status: 'success', data: apiResponse.data } as const;
        }),
        catchError((err: HttpErrorResponse) => {
          const message = err.error?.message || 'The Update request Failed.';
          return of({ status: 'error', error: message } as const);
        }),
      );
  }
}
