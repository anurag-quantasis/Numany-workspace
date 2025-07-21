import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const TenantInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  // TODO: Replace 'YOUR_TENANT_ID' with your actual tenant identifier.
  // You might get this from a service, environment file, or a constants file.
  const tenantId = '2cfbc6b7-1156-49a9-a961-f847f3ef875c';

  const clonedReq = req.clone({
    headers: req.headers.set('X-Tenant-ID', tenantId).set('ngrok-skip-browser-warning', 'true'),
  });

  return next(clonedReq);
};
