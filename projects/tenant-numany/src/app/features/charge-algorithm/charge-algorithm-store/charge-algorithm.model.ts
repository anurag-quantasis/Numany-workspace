export interface CostRange {
  lowEnd: number;
  hiEnd: number;
  administrationFee: number;
  markupFactor: number;
  minCharge: number;
}

export interface ChargeParameter {
  id: string;
  classId: string;
  className: string;
  costRanges: CostRange[];
}

export interface ChargeParameters {
  id: string;
  ichid: string;
  namcls: string;
  lo1: number;
  hi1: number;
  fee1: number;
  markup1: number;
  minchrg1: number;
  lo2: number;
  hi2: number;
  fee2: number;
  markup2: number;
  minchrg2: number;
  lo3: number;
  hi3: number;
  fee3: number;
  markup3: number;
  minchrg3: number;
  lo4: number;
  hi4: number;
  fee4: number;
  markup4: number;
  minchrg4: number;
  lo5: number;
  hi5: number;
  fee5: number;
  markup5: number;
  minchrg5: number;
}

export interface ChargeParameterResponse {
  chargeparameter: ChargeParameter;
  message: string;
}
