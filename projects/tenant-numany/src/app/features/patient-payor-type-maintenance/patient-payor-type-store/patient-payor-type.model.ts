export interface PatientPayor {
  id_pay: string;
  nam_pay: string;
  iad_py: string;
  ict_py: string;
  ist_py: string;
  izp_py: string;
  iph_py: string;
  imsp_py: string;
  ipy_cb: string;
  icc_py: string;
  non_emar_pay: boolean;
}

export interface PatientPayorPayload {
  payor: PatientPayor;
}

export interface PatientPayorResponse {
  data: PatientPayor[];
  paging: PagingInfo;
}

export interface AddPatientPayorResponse {
  data: PatientPayor;
  message: string;
}

export interface PagingInfo {
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
