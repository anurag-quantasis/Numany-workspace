export interface TenantLabResult {
  id_lab: string;       
  nam_lab: string;      
  l_units: string;      
  inc_rpt: boolean;     
  low_norm: number;
  hi_norm: number;
  id_host: string;
  status: number;       
}

export interface TenantLabResultResponse {
  data: TenantLabResult[];
  paging: PagingInfo;
}

export interface TenantLabResultUpdateResponse {
  isUpdated: boolean;
  message: string;
}

export interface PagingInfo {
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface TenantLabResultPayload {
  lab: TenantLabResult;
}

export interface TenantLabDeleteResponse {
  isDeleted: boolean;
  message: string;
}

export interface TenantLabAddResponse {
  data: TenantLabResult;
  message: string;
}