import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const MainInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const cloneReq = req.clone({
    headers: req.headers.set('ngrok-skip-browser-warning', 'true'),
  });
  return next(cloneReq);
};
