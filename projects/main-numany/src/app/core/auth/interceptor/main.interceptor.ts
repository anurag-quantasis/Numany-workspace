import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const MainInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  // TODO: Replace 'YOUR_TENANT_ID' with your actual tenant identifier.
  // You might get this from a service, environment file, or a constants file.
  const tenantId = '53580b45-647c-4fca-92d6-11df2282136f';

  const clonedReq = req.clone({
    headers: req.headers.set('X-Tenant-ID', tenantId).set('ngrok-skip-browser-warning', 'true'),
  });

  return next(clonedReq);
};
