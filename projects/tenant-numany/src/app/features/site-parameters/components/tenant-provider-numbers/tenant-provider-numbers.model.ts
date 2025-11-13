// Interface representing the data for a single dropdown option
export interface TpBillingOption {
  label: string;
  value: number;
}

// Interface for the entire form's data structure
export interface ProviderNumbers {
  deaNumber: string | null;
  ncpdpNumber: string | null;
  medicareProvider: string | null;
  medicaidProvider: string | null;
  npi: string | null;
  stateLicense: string | null;
  tpBilling: number | null;
}
