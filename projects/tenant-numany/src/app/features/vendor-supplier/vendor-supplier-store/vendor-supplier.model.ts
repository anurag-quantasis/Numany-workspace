export interface Vendor {
  id_vend: string;
  nam_vend: string;
  note: string;
  vm_td: number;
  vy_td: number;
  acct_no: string;
}

export interface VendorResponse {
  data: Vendor[];
  paging: PagingInfo;
}

export interface PagingInfo {
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface VendorPayload {
  vendor: Vendor;
}
