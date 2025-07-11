import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const TenantInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  // TODO: Replace 'YOUR_TENANT_ID' with your actual tenant identifier.
  // You might get this from a service, environment file, or a constants file.
<<<<<<< HEAD
  const tenantId = '53580b45-647c-4fca-92d6-11df2282136f';
=======
  const tenantId = 'B2B9ACF1-70CC-483F-B171-B0C3EBB41F8E';
>>>>>>> ef6fa5d507797577e937fa7dfbc1a52255b3ddc2

  const clonedReq = req.clone({
    headers: req.headers.set('X-Tenant-ID', tenantId).set('ngrok-skip-browser-warning', 'true'),
  });

  return next(clonedReq);
};
