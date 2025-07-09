import { inject, Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
import { ApiResponse, Bed, NewBed, PaginatedBedsResponse } from '../bed-store/beds.model';
import { LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { ApiService } from '../../../core/services/api.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

// --- API Data Transfer Objects (DTOs) ---
// These interfaces exactly match the JSON from your backend.

interface ApiBed {
  id: string;
  bed_Seq: number;
  id_Bed: string;
  id_Area: string;
  ip_Sec: number;
  oeip: boolean;
  status: number;
}

interface ApiPaging {
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// For GET /beds
interface ApiGetBedsResponse {
  data: ApiBed[];
  paging: ApiPaging;
}

// For POST, DELETE, etc.
interface ApiMutationResponse {
  data: ApiBed | null;
  message: string | null;
}

@Injectable({ providedIn: 'root' })
export class BedService {
  private apiService = inject(ApiService);
  private readonly bedsEndpoint = '/beds';
  private readonly singleBedEndpoint = '/bed';

  getBeds(event: TableLazyLoadEvent): Observable<ApiResponse<PaginatedBedsResponse>> {
    const params = this.createHttpParams(event);

    return this.apiService.get<ApiGetBedsResponse>(this.bedsEndpoint, { params }).pipe(
      map((apiResponse) => {
        // Map the snake_case API data to our clean, camelCase Bed model
        const mappedItems: Bed[] = apiResponse.data.map((apiBed) => ({
          id: apiBed.id,
          name: apiBed.id_Bed,
          area: apiBed.id_Area,
          section: apiBed.ip_Sec, // Or however you wish to format it
        }));

        const paginatedData: PaginatedBedsResponse = {
          items: mappedItems,
          totalRecords: apiResponse.paging.totalItems,
        };

        return { status: 'success', data: paginatedData } as const;
      }),
      // This `catchError` handles network/server errors (e.g., 500, 404)
      catchError((err: HttpErrorResponse) => {
        const message = 'Could not connect to the server. Please try again later.';
        return of({ status: 'error', error: message } as const);
      }),
    );
  }

  addBed(newBed: NewBed): Observable<ApiResponse<Bed>> {
    // Create the payload the API expects
    const apiPayload = {
      bed: {
        id_Bed: newBed.name,
        id_Area: newBed.area,
        ip_Sec: newBed.section,
      },
    };

    return this.apiService.post<ApiMutationResponse>(this.singleBedEndpoint, apiPayload).pipe(
      map((apiResponse) => {
        // Check for a business logic error (e.g., "ID already in use")
        if (!apiResponse.data) {
          return {
            status: 'error',
            error: apiResponse.message || 'An unknown error occurred.',
          } as const;
        }

        // It was a true success, so map the response to our Bed model
        const createdBed: Bed = {
          id: apiResponse.data.id,
          name: apiResponse.data.id_Bed,
          area: apiResponse.data.id_Area,
          section: apiResponse.data.ip_Sec,
        };

        return { status: 'success', data: createdBed } as const;
      }),
      catchError((err: HttpErrorResponse) => {
        // Handle network/server errors
        const message = err.error?.message || 'The request failed.';
        return of({ status: 'error', error: message } as const);
      }),
    );
  }

  updateBed(bedToUpdate: Bed): Observable<ApiResponse<Bed>> {
    // 1. Create the nested payload required by the API
    const apiPayload = {
      bed: {
        id: bedToUpdate.id,
        id_Bed: bedToUpdate.name,
        id_Area: bedToUpdate.area,
        ip_Sec: Number(bedToUpdate.section), // Ensure section is a number
      },
    };

    // 2. Make the PUT request to the specific bed's endpoint
    return this.apiService
      .put<ApiMutationResponse>(`${this.singleBedEndpoint}/${bedToUpdate.id}`, apiPayload)
      .pipe(
        map((apiResponse) => {
          // 3. Check for business logic errors from the API
          if (!apiResponse.data) {
            return {
              status: 'error',
              error: apiResponse.message || 'An unknown error occurred.',
            } as const;
          }

          // 4. On true success, map the result back to our clean Bed model
          const updatedBed: Bed = {
            id: apiResponse.data.id,
            name: apiResponse.data.id_Bed,
            area: apiResponse.data.id_Area,
            section: apiResponse.data.ip_Sec,
          };

          return { status: 'success', data: updatedBed } as const;
        }),
        // 5. Handle network or server errors
        catchError((err: HttpErrorResponse) => {
          const message = err.error?.message || 'The update request failed.';
          return of({ status: 'error', error: message } as const);
        }),
      );
  }

  deleteBed(bedId: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiMutationResponse>(`${this.singleBedEndpoint}/${bedId}`).pipe(
      map((apiResponse) => {
        if (apiResponse.message && apiResponse.data === null) {
          return { status: 'error', error: apiResponse.message } as const;
        }
        return { status: 'success', data: undefined } as const;
      }),
      catchError((err: HttpErrorResponse) => {
        const message = err.error?.message || 'The delete operation failed.';
        return of({ status: 'error', error: message } as const);
      }),
    );
  }

  /** Helper to create standard pagination params. */
  private createHttpParams(event: TableLazyLoadEvent): HttpParams {
    let params = new HttpParams();
    params = params.set('pageNumber', ((event.first ?? 0) / (event.rows ?? 10) + 1).toString());
    params = params.set('pageSize', (event.rows ?? 10).toString());
    if (event.globalFilter) {
      // params = params.set('search', event.globalFilter);
    }
    return params;
  }
}
