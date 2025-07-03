export interface Bed {
  id: string; // The unique Bed ID from the backend
  area: string;
  section: string;
  name: string;
}

// A DTO for creating a new bed, without the server-generated 'id'
export type NewBed = Omit<Bed, 'id'>;

// The structure your API should return for a paginated list
export interface PaginatedBedsResponse {
  items: Bed[];
  totalRecords: number;
}
