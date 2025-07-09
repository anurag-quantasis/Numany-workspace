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
