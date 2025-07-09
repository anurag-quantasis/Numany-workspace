export interface Bed {
  id: string; // The unique Bed ID from the backend
  area: string;
  section: number;
  name: string;
}

// A DTO for creating a new bed, without the server-generated 'id'
export type NewBed = Omit<Bed, 'id'>;

// The structure your API should return for a paginated list
export interface PaginatedBedsResponse {
  items: Bed[];
  totalRecords: number;
}

// A successful response contains the data.
export type ApiSuccessResponse<T> = {
  status: 'success';
  data: T;
};

// An error response contains the error message.
export type ApiErrorResponse = {
  status: 'error';
  error: string;
};

// The service will always return one of these two shapes.
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;