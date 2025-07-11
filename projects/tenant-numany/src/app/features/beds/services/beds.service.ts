import { inject, Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
import { ApiResponse, Bed, NewBed, PaginatedBedsResponse } from '../bed-store/beds.model';
import { FilterMetadata, LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { ApiService } from '../../../core/services/api.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { createHttpParams } from '../../../shared/utils/utils';

// --- API Data Transfer Objects (DTOs) ---
// These interfaces exactly match the JSON from your backend.


interface ApiPaging {
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// For GET /beds
interface ApiGetBedsResponse {
  data: Bed[];
  paging: ApiPaging;
}

// For POST, DELETE, etc.
interface ApiMutationResponse {
  data: Bed | null;
  message: string | null;
}

@Injectable({ providedIn: 'root' })
export class BedService {
  private apiService = inject(ApiService);
  private readonly bedsEndpoint = '/beds';
  private readonly singleBedEndpoint = '/bed';

  getBeds(event: TableLazyLoadEvent): Observable<ApiResponse<PaginatedBedsResponse>> {
    const params = createHttpParams(event);

    return this.apiService.get<ApiGetBedsResponse>(this.bedsEndpoint, { params }).pipe(
      map((apiResponse) => {
        // Map the snake_case API data to our clean, camelCase Bed model
        const paginatedData: PaginatedBedsResponse = {
          items: apiResponse.data, // Just use the data as-is
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
    // 1. Create the payload the API expects from your `NewBed` form model.
    //    This is the "mapping on the way in".
    const apiPayload = {
      bed: {
        id_Bed: newBed.name,
        id_Area: newBed.area,
        ip_Sec: newBed.section,
      },
    };

    return this.apiService.post<ApiMutationResponse>(this.singleBedEndpoint, apiPayload).pipe(
      map((apiResponse) => {
        // 2. Check for business logic errors from the API.
        if (!apiResponse.data) {
          return {
            status: 'error',
            error: apiResponse.message || 'An unknown error occurred.',
          } as const;
        }

        // 3. On success, return the full `Bed` object from the API directly.
        //    No manual mapping is needed here because the response `data`
        //    already matches your `Bed` interface.
        return { status: 'success', data: apiResponse.data } as const;
      }),
      catchError((err: HttpErrorResponse) => {
        const message = err.error?.message || 'The request failed.';
        return of({ status: 'error', error: message } as const);
      }),
    );
  }

  updateBed(bedToUpdate: Bed): Observable<ApiResponse<Bed>> {
    // 1. Create the payload from the full `Bed` object.
    //    Your API example shows it expects `id`, `id_Bed`, `id_Area`, and `ip_Sec`.
    const apiPayload = {
      bed: {
        id: bedToUpdate.id,
        id_Bed: bedToUpdate.id_Bed,
        id_Area: bedToUpdate.id_Area,
        ip_Sec: Number(bedToUpdate.ip_Sec), // Ensure it's a number
      },
    };

    // The endpoint includes the bed's ID.
    const updateUrl = `${this.singleBedEndpoint}/${bedToUpdate.id}`;

    return this.apiService.put<ApiMutationResponse>(updateUrl, apiPayload).pipe(
      map((apiResponse) => {
        // 2. Check for business logic errors.
        if (!apiResponse.data) {
          return {
            status: 'error',
            error: apiResponse.message || 'An unknown error occurred.',
          } as const;
        }

        // 3. On success, return the full `Bed` object from the API directly.
        return { status: 'success', data: apiResponse.data } as const;
      }),
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
  // private createHttpParams(event: TableLazyLoadEvent): HttpParams {
  //   let params = new HttpParams();

  //   // 1. Handle Pagination
  //   // Your backend seems to use page/size, so we calculate it
  //   const page = (event.first ?? 0) / (event.rows ?? 10);
  //   const size = event.rows ?? 10;
  //   params = params.set('page', page.toString());
  //   params = params.set('size', size.toString());

  //   // 2. Handle Sorting (Good practice to add)
  //   if (event.sortField && typeof event.sortField === 'string') {
  //     const sortDirection = event.sortOrder === 1 ? 'asc' : 'desc';
  //     // Your backend might expect a format like 'sort=name,asc'
  //     params = params.set('sort', `${event.sortField},${sortDirection}`);
  //   }

  //   // 3. Handle Filtering (THIS IS THE FIX)
  //   if (event.filters) {
  //     // Loop over each filter the user has applied in the table
  //     for (const field in event.filters) {
  //       const filterMeta = event.filters[field];

  //       // PrimeNG puts filter data in an array, we usually care about the first one.
  //       // We also check that the value is not null or an empty string.
  //       const filterValue = Array.isArray(filterMeta) ? filterMeta[0].value : filterMeta?.value;

  //       if (filterValue !== null && filterValue !== undefined && filterValue !== '') {
  //         // This adds query parameters to the request, like:
  //         // &name=some_value
  //         // &area=another_value
  //         params = params.set(field, filterValue);
  //       }
  //     }
  //   }

  //   return params;
  // }
  // private createHttpParams(event: TableLazyLoadEvent): HttpParams {
  //   let params = new HttpParams();

  //   // 1. Handle Pagination (Assuming this is still needed)
  //   const page = Math.floor(event.first ?? 0) / (event.rows ?? 10) + 1;
  //   const size = event.rows ?? 10;
  //   params = params.set('pageNumber', page.toString());
  //   params = params.set('pageSize', size.toString());

  //   // 2. Handle OData Sorting
  //   if (event.sortField && typeof event.sortField === 'string') {
  //     const sortDirection = event.sortOrder === 1 ? 'asc' : 'desc';
  //     // OData standard sort format is 'field direction'
  //     params = params.set('$orderby', `${event.sortField} ${sortDirection}`);
  //   }

  //   // 3. Handle OData Filtering (THE MAIN FIX)
  //   const filterClauses: string[] = [];

  //   if (event.filters) {
  //     for (const field in event.filters) {
  //       const filterMeta = event.filters[field] as FilterMetadata | FilterMetadata[];
        
  //       // PrimeNG can send a single or an array of filters
  //       const filters = Array.isArray(filterMeta) ? filterMeta : [filterMeta];

  //       for (const filter of filters) {
  //         if (filter.value !== null && filter.value !== undefined && filter.value !== '') {
  //           const clause = this.createODataClause(field, filter);
  //           if(clause) {
  //             filterClauses.push(clause);
  //           }
  //         }
  //       }
  //     }
  //   }
    
  //   // Join all individual clauses with 'and' and add to the '$filter' parameter
  //   if (filterClauses.length > 0) {
  //     params = params.set('filter', filterClauses.join(' and '));
  //   }

  //   return params;
  // }
  
  /**
   * Helper to create a single OData clause from PrimeNG filter metadata.
   */
  // private createODataClause(field: string, filter: FilterMetadata): string | null {
  //   const value = filter.value;
  //   const matchMode = filter.matchMode || 'contains'; // Default to 'contains'

  //   // For strings, wrap in single quotes and escape any existing single quotes
  //   const formatString = (val: string) => `'${val.replace(/'/g, "''")}'`;

  //   switch (matchMode) {
  //     // String functions
  //     case 'contains':
  //       return `contains(tolower(${field}), tolower(${formatString(value)}))`;
  //     case 'notContains':
  //       return `not contains(tolower(${field}), tolower(${formatString(value)}))`;
  //     case 'startsWith':
  //       return `startswith(tolower(${field}), tolower(${formatString(value)}))`;
  //     case 'endsWith':
  //       return `endswith(tolower(${field}), tolower(${formatString(value)}))`;

  //     // Equality
  //     case 'equals':
  //     case 'eq':
  //       return `${field} eq ${typeof value === 'string' ? formatString(value) : value}`;
  //     case 'notEquals':
  //     case 'ne':
  //       return `${field} ne ${typeof value === 'string' ? formatString(value) : value}`;

  //     // Relational
  //     case 'lt':
  //       return `${field} lt ${value}`;
  //     case 'lte':
  //       return `${field} le ${value}`;
  //     case 'gt':
  //       return `${field} gt ${value}`;
  //     case 'gte':
  //       return `${field} ge ${value}`;
      
  //     // We don't handle other modes by default
  //     default:
  //       console.warn(`OData mapping for matchMode '${matchMode}' is not implemented.`);
  //       return null;
  //   }
  // }
}
