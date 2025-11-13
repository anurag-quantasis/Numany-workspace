// Represents the main Tenant object used throughout the app.
export interface Tenant {
  id: string; // Make 'id' required for existing tenants.
  name: string;
  description: string;
  emailId: string;
  address: string;
  password?: string; // Optional as it shouldn't be sent back to the client.
  expiryDate: string | Date;
}

// Use this type for creating a new tenant. 'id' is omitted.
export type NewTenant = Omit<Tenant, 'id'>;

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
