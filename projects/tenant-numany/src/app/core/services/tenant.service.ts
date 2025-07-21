import { Injectable, signal } from "@angular/core";


@Injectable({
  providedIn: 'root'
}) export class TenantService {
  // The '#' makes it a true private class field.
  #tenantId = signal<string | null>(null);

  // Expose the tenantId as a public, readonly signal.
  // Consumers can react to changes but cannot modify the state directly.
  public readonly tenantId = this.#tenantId.asReadonly();

  setTenantId(tenantId: string): void {
    this.#tenantId.set(tenantId);
  }
}