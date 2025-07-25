export interface InterventionTypes {
  pi_id: string;
  description: string;
  sl_me: boolean;
  cl_me: boolean;
  sc_me: boolean;
  pc_me: boolean;
  sl_adr: boolean;
  adr_type: boolean;
  acuity: boolean;
  fi: boolean;
  pi_hide: boolean;
  oc: boolean;
}

export interface InterventionTypesResponse {
  data: InterventionTypes[];
  paging: PagingInfo;
}

export interface AddInterventionTypesResponse {
  data: InterventionTypes;
  message: string;
}

export interface PagingInfo {
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface InterventionTypesPayload {
  interventionType: InterventionTypes;
}
