export interface TenantSummary {
  id: string;
  name: string;
  subdomain: string;
  userCount: number;
}

export interface MainState {
  tenants: TenantSummary[];
  isLoading: boolean;
  error: string | null;
}