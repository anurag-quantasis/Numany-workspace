export interface Physician {
  id_doc: string;
  nam_doc: string;
  dea_no: string;
  phone: string;
  adr_doc: string;
  cty_doc: string;
  st_doc: string;
  zip_doc: string;
  st_lic: string;
  up_in: string;
  npi: string;
  m_care_dr: string;
  m_caid_dr: string;
  hide_dr: boolean;
  e_rx_yn: boolean;
  local_id: string;
}

export interface PhysicianResponse {
  data: Physician[];
  paging: PagingInfo;
}

export interface PagingInfo {
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface PhysicianPayload {
  doctor: Physician;
}
