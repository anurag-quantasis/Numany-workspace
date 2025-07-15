import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const TenantInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  // TODO: Replace 'YOUR_TENANT_ID' with your actual tenant identifier.
  // You might get this from a service, environment file, or a constants file.
  const tenantId = '962A5281-F3EF-4748-9885-7D3ADA1075E1';

  const clonedReq = req.clone({
    headers: req.headers.set('X-Tenant-ID', tenantId).set('ngrok-skip-browser-warning', 'true'),
  });

  return next(clonedReq);
};
