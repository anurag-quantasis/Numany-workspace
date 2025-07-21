// src/app/core/auth/tenant.initializer.ts
import { isDevMode, inject } from '@angular/core';
import { TenantService } from '../../services/tenant.service';

/**
 * An initializer function that determines the tenant ID from the hostname.
 * This function is passed directly to `provideAppInitializer` and runs in an
 * injection context, so `inject()` can be used.
 */
export function initializeTenant(): void { // The signature is now simpler: () => void
  const tenantService = inject(TenantService);
  const hostname = window.location.hostname;

  // The logic is no longer wrapped in a returned function.
  if (isDevMode()) {
    if (hostname.endsWith('.localhost')) {
      const tenantId = hostname.split('.')[0];
      tenantService.setTenantId(tenantId);
      console.log(
        `%c[Tenant Initializer (Dev)] Tenant ID set from hostname: "${tenantId}"`,
        'color: blue; font-weight: bold;'
      );
    } else {
      const defaultDevTenant = 'dev-tenant';
      tenantService.setTenantId(defaultDevTenant);
      console.warn(
        `[Tenant Initializer (Dev)] Hostname does not end in .localhost. Using default: "${defaultDevTenant}".`
      );
      console.info(
        `Tip: After editing your hosts file, access via a URL like: http://tenant1.localhost:4200`
      );
    }
  } else {
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      const tenantId = parts[0];
      tenantService.setTenantId(tenantId);
    } else {
      console.error('Could not determine production tenant ID from hostname:', hostname);
    }
  }
}