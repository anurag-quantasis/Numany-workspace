export interface InterventionDataClasses {
  ac_id: string;
  ac_desc: string;
  ac_amt: number;
  pi_hide: boolean;
}

export interface AddInterventionDataClassesResponse {
  data: InterventionDataClasses;
  message: string;
}

export interface InterventionDataClassesResponse {
  data: InterventionDataClasses[];
  paging: PagingInfo;
}

export interface InterventionDataClassesPayload {
  interventionDataCls: InterventionDataClasses;
}

export interface PagingInfo {
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
