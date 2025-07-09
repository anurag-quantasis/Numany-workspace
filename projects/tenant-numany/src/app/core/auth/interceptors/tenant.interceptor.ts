import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const TenantInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // TODO: Replace 'YOUR_TENANT_ID' with your actual tenant identifier.
  // You might get this from a service, environment file, or a constants file.
  const tenantId = 'cfe6014a-3a9e-40d3-9ce9-a081d58e6184';

  const clonedReq = req.clone({
    headers: req.headers
      .set('X-Tenant-ID', tenantId)
      .set('ngrok-skip-browser-warning', 'true'),
  });

  return next(clonedReq);
};