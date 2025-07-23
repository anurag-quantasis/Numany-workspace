import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { TenantService } from '../../services/tenant.service';
import { inject } from '@angular/core';

export const TenantInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  // TODO: Replace 'YOUR_TENANT_ID' with your actual tenant identifier.
  // You might get this from a service, environment file, or a constants file.
  const tenantService = inject(TenantService);

  const tenantId = tenantService.tenantId();
  if (tenantId) {
    // Clone the request to add the new headers, as requests are immutable.
    const clonedReq = req.clone({
      headers: req.headers
        .set('X-Tenant-ID', tenantId)
        // I'm keeping this header from your example, as it's useful for ngrok.
        .set('ngrok-skip-browser-warning', 'true'),
    });

    // Pass the cloned request to the next handler in the chain.
    return next(clonedReq);
  }

  // If no tenantId is available, pass the original request without modification.
  return next(req);
};
