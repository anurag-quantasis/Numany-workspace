export interface Department {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  note: string;
  cost_basis: string;
  markup: number;
  tax_flag: string;
}

export interface DepartmentResponse {
  data: Department[];
  paging: PagingInfo;
}

export interface AddDepartmentResponse {
  data: Department;
  message: string;
}

export interface PagingInfo {
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface DepartmentPayload {
  department: Department;
}
