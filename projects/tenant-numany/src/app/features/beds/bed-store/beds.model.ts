export interface Bed {
  id: string;
  bed_Seq?: number;
  id_Bed: string;
  id_Area: string;
  ip_Sec: number;
  oeip?: boolean;
  status?: number;
  patientName?: string;
}

// A DTO for creating a new bed, without the server-generated 'id'
export interface NewBed {
  name: string;
  area: string;
  section: number;
}

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
