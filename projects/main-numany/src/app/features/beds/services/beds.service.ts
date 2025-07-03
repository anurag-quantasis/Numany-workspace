import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { Bed, NewBed, PaginatedBedsResponse } from '../bed-store/beds.model';
import { LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';

// --- MOCK DATABASE ---
const MOCK_BEDS: Bed[] = Array.from({ length: 55 }, (_, i) => ({
  id: `bed_${i + 1}`,
  name: `Patient Bed ${i + 1}`,
  area: `Area ${(i % 4) + 1}`,
  section: `Section ${String.fromCharCode(65 + (i % 3))}`, // A, B, C
}));
// --- END MOCK ---

@Injectable({ providedIn: 'root' })
export class BedService {
  // Simulate fetching a paginated list of beds from an API
  getBeds(event: TableLazyLoadEvent): Observable<PaginatedBedsResponse> {
    const page = (event.first || 0) / (event.rows || 10);
    const pageSize = event.rows || 10;

    // Simple filter simulation
    const filterQuery = (event.globalFilter as string)?.toLowerCase() || '';
    const filteredData = MOCK_BEDS.filter(
      (bed) =>
        bed.name.toLowerCase().includes(filterQuery) ||
        bed.area.toLowerCase().includes(filterQuery) ||
        bed.section.toLowerCase().includes(filterQuery),
    );

    const paginatedItems = filteredData.slice(page * pageSize, (page + 1) * pageSize);

    return of({
      items: paginatedItems,
      totalRecords: filteredData.length,
    }).pipe(delay(500)); // Simulate network latency
  }

  // Simulate adding a new bed
  addBed(newBed: NewBed): Observable<Bed> {
    // Simulate validation
    if (MOCK_BEDS.some((b) => b.name.toLowerCase() === newBed.name.toLowerCase())) {
      return throwError(() => new Error(`A bed with the name "${newBed.name}" already exists.`));
    }

    const bed: Bed = {
      ...newBed,
      id: `bed_${Date.now()}`, // Generate a unique ID
    };
    MOCK_BEDS.unshift(bed); // Add to the start of the list

    return of(bed).pipe(delay(500));
  }

  // --- NEW METHOD TO SIMULATE DELETING A BED ---
  /**
   * Simulates deleting a bed by its ID from the mock database.
   * @param bedId The string ID of the bed to delete.
   * @returns An Observable of void on success, or an error if the bed is not found.
   */
  deleteBed(bedId: string): Observable<void> {
    // Find the index of the bed to delete.
    const bedIndex = MOCK_BEDS.findIndex((b) => b.id === bedId);

    // If the bed wasn't found, simulate a "Not Found" error from the API.
    if (bedIndex === -1) {
      return throwError(() => new Error(`Bed with ID ${bedId} not found.`)).pipe(delay(500));
    }

    // If found, remove it from the array.
    MOCK_BEDS.splice(bedIndex, 1);

    // A real HTTP DELETE often returns a 204 No Content status.
    // We simulate this by returning an Observable of void.
    return of(undefined).pipe(delay(500));
  }
}
